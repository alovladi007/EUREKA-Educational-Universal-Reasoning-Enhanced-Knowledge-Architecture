#!/usr/bin/env python3
"""Convert the FE EE lesson prose from ad-hoc plain-text maths to KaTeX.

The course reader already loads remark-math and rehype-katex, so `$...$` and
`$$...$$` render properly. The content was authored with Unicode substitutes
instead - omega-zero as a literal glyph, superscripts as characters, fractions
as slashes - which sets equations in body text at body weight and leaves
subscripts too small to read.

CONSERVATIVE BY DESIGN. There is far more non-mathematical text in this file
than mathematical, and some of it looks mathematical to a naive matcher:

    | B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 |
    | 20/21 | FTP | TCP | File transfer |
    | Coaxial cable (50 ohm) | RF measurement |

so the rule is that a span is converted only on strong evidence - a relation
sign, or a Greek letter or maths operator sitting next to a quantity - never
because it merely contains digits and a slash.

FIGURE ALT TEXT IS NEVER TOUCHED. Alt text is both the visible caption and the
screen-reader text; TeX source read aloud is worse than useless, so ![...](...)
is masked out before any rule runs.

Usage:
    python3 scripts/latexify_fe_ee.py --dry        # report + sample diff
    python3 scripts/latexify_fe_ee.py              # write
"""
from __future__ import annotations

import argparse
import pathlib
import re

DATA = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "src" / "lib" / "fe-ee-course-data.ts"
)

# --------------------------------------------------------------------------
# Symbol vocabulary
# --------------------------------------------------------------------------

GREEK = {
    "α": r"\alpha", "β": r"\beta", "γ": r"\gamma", "δ": r"\delta",
    "ε": r"\varepsilon", "ζ": r"\zeta", "η": r"\eta", "θ": r"\theta",
    "κ": r"\kappa", "λ": r"\lambda", "μ": r"\mu", "µ": r"\mu",
    "ν": r"\nu", "ξ": r"\xi", "π": r"\pi", "ρ": r"\rho", "σ": r"\sigma",
    "τ": r"\tau", "φ": r"\phi", "ϕ": r"\phi", "χ": r"\chi", "ψ": r"\psi",
    "ω": r"\omega", "Γ": r"\Gamma", "Δ": r"\Delta", "Θ": r"\Theta",
    "Λ": r"\Lambda", "Ξ": r"\Xi", "Π": r"\Pi", "Σ": r"\Sigma",
    "Φ": r"\Phi", "Ψ": r"\Psi", "Ω": r"\Omega",
}
OPS = {
    "×": r"\times", "·": r"\cdot", "÷": r"\div", "±": r"\pm", "∓": r"\mp",
    "≈": r"\approx", "≤": r"\le", "≥": r"\ge", "≠": r"\ne", "∝": r"\propto",
    "∞": r"\infty", "∠": r"\angle", "∂": r"\partial", "∇": r"\nabla",
    "→": r"\to", "⇒": r"\Rightarrow", "∈": r"\in", "∪": r"\cup",
    "∩": r"\cap", "∫": r"\int", "≡": r"\equiv", "°": r"^\circ", "−": "-", "∮": r"\oint",
    "∧": r"\wedge", "∨": r"\vee", "¬": r"\neg", "↔": r"\leftrightarrow",
    "½": r"\tfrac{1}{2}", "⅓": r"\tfrac{1}{3}", "ℓ": r"\ell",
    "′": "'", "″": "''", "‖": r"\parallel", "∥": r"\parallel", "ⁿ": "^{n}", "ᵀ": "^{T}", "ᵇ": "^{b}", "ᵗ": "^{t}", "ˣ": "^{x}",
    "ŷ": r"\hat{y}", "ẋ": r"\dot{x}", "–": "-", "\u0304": "", "\u0302": "",
}
# Letter subscripts are as common here as digits - omega-n for natural
# frequency, V-s for source, x-i for an index - and a digits-only table left
# them as raw glyphs inside otherwise-converted maths.
SUB = str.maketrans("₀₁₂₃₄₅₆₇₈₉₊₋ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ",
                    "0123456789+-aehijklmnoprstuvx")
SUBCHARS = "₀₁₂₃₄₅₆₇₈₉₊₋ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ"
# NOTE the first three: superscript one, two and three are U+00B9/B2/B3 in
# Latin-1, NOT in the U+2070 superscripts block with the rest. A character
# range of ⁰-⁹ silently excludes exactly the squares and cubes this course is
# full of, and Python also treats them as word characters (they are .isalnum()),
# so a following \b does not fire either. Both bugs are invisible in the output
# - the glyph just survives unconverted - so they are listed explicitly.
SUP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻¹²³", "0123456789+-123")
SUPCHARS = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻¹²³"

MATHY = set(GREEK) | set(OPS) | set(SUBCHARS) | set(SUPCHARS) | set("√∡")


def _protect(text: str) -> tuple[str, list[str]]:
    """Mask spans no rule may touch: image alt text, links, code, existing TeX."""
    stash: list[str] = []

    def keep(m: re.Match) -> str:
        stash.append(m.group(0))
        return "\x00%d\x00" % (len(stash) - 1)

    for pat in (r"!\[[^\]]*\]\([^)]*\)",   # images: alt text is the caption
                r"`[^`]*`",                 # inline code
                r"\$\$?[^$]*\$\$?",         # already converted
                r"\[[^\]]*\]\([^)]*\)"):    # links
        text = re.sub(pat, keep, text)
    return text, stash


def _restore(text: str, stash: list[str]) -> str:
    return re.sub(r"\x00(\d+)\x00", lambda m: stash[int(m.group(1))], text)


# --------------------------------------------------------------------------
# Expression translation
# --------------------------------------------------------------------------

def _caret_group(s: str) -> str:
    """Rewrite ^( ... ) into ^{ ... } honouring nested parentheses."""
    out, i = [], 0
    while i < len(s):
        if s[i] == "^" and i + 1 < len(s) and s[i + 1] == "(":
            depth, j = 0, i + 1
            while j < len(s):
                if s[j] == "(":
                    depth += 1
                elif s[j] == ")":
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            if j < len(s):
                out.append("^{" + s[i + 2:j] + "}")
                i = j + 1
                continue
        out.append(s[i])
        i += 1
    return "".join(out)


def to_tex(expr: str) -> str:
    """Translate one already-identified maths expression into TeX."""
    s = expr

    # sqrt, both as the glyph and spelled out
    s = re.sub(r"√\(([^()]*(?:\([^()]*\)[^()]*)*)\)", r"\\sqrt{\1}", s)
    s = re.sub(r"√([A-Za-z0-9.]+)", r"\\sqrt{\1}", s)
    # NOT \bsqrt: "2sqrt(L/C)" has a digit in front, so the word boundary
    # never fires and the command survives as the letters s-q-r-t. Square
    # brackets are also used as the argument delimiter in places.
    s = re.sub(r"(?<![A-Za-z\\])sqrt\(([^()]*(?:\([^()]*\)[^()]*)*)\)",
               r"\\sqrt{\1}", s)
    s = re.sub(r"(?<![A-Za-z\\])sqrt\[([^\[\]]*)\]", r"\\sqrt{\1}", s)

    # Unicode sub/superscript runs -> _{...} / ^{...}
    s = re.sub(r"[%s]+" % SUBCHARS,
               lambda m: "_{%s}" % m.group(0).translate(SUB), s)
    s = re.sub(r"[%s]+" % SUPCHARS,
               lambda m: "^{%s}" % m.group(0).translate(SUP), s)

    for k, v in OPS.items():
        s = s.replace(k, v + " " if v.startswith("\\") else v)
    for k, v in GREEK.items():
        s = s.replace(k, v + " ")

    # multi-character subscripts need braces: P_total -> P_{total}
    s = re.sub(r"_([A-Za-z]{2,})\b", r"_{\1}", s)
    # ^(...) with BALANCED parentheses. A non-greedy [^)]* stops at the first
    # inner ")" and produced e^{-(x-\mu}^{2}, a double superscript KaTeX
    # rejects outright.
    s = _caret_group(s)

    # % is LaTeX's comment character: an unescaped one silently comments out
    # the remainder of the expression, including its closing $.
    s = re.sub(r"(?<!\\)%", r"\\%", s)

    # Adjacent superscripts are a parse error, and they arise naturally:
    # x-super-n-super-minus-one converts in two passes (the letter from the
    # symbol map, the digits from the run rule) and lands as x^{n}^{-1}.
    while re.search(r"\^\{([^{}]*)\}\^\{([^{}]*)\}", s):
        s = re.sub(r"\^\{([^{}]*)\}\^\{([^{}]*)\}", r"^{\1\2}", s)

    # a subscript cannot take a subscript: f_{s}_{min} -> f_{s,min}
    while re.search(r"_\{([^{}]*)\}_\{([^{}]*)\}", s):
        s = re.sub(r"_\{([^{}]*)\}_\{([^{}]*)\}", r"_{\1,\2}", s)

    # Units read as upright text. A SPACE is required before the unit: without
    # it, cos(2A) becomes "2 amperes" because A is a valid unit symbol, and the
    # same trap waits for V, W, F, H, J and S.
    s = re.sub(r"(?<=[\d}])[ ]+(rad/s|kVAR|kVA|VAR|dB|Hz|kHz|MHz|GHz|"
               r"mA|kA|mV|kV|kW|MW|mJ|mF|nF|pF|mH|uH|ms|us|ns|"
               r"A|V|W|J|F|H|S|s)\b", r"\\ \\mathrm{\1}", s)
    s = re.sub(r"(?<=[\d}])[ ]*\\Omega\b", r"\\ \\Omega", s)

    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([)\],;}])", r"\1", s)      # no gap before closers
    s = re.sub(r"\\+\s*$", "", s)                 # no dangling command
    return s.strip()


# --------------------------------------------------------------------------
# Span detection
# --------------------------------------------------------------------------

RELATION = re.compile(r"(?<![<>=!])=(?!=)|≈|≤|≥|≠|∝|(?<![-<>])[<>](?![>=-])")

# Span detection is a LINEAR word scan, not a regex. The first attempt used a
# regex of the shape ((?:TOKEN|[SYM]|\s)*[SYM](?:TOKEN|[SYM]|\s)*), whose
# nested quantifiers backtrack exponentially - it did not finish on this file.
# Classifying whitespace-separated words and grouping maximal maths runs is
# linear, and it is also easier to reason about which words get captured.

_UNIT = (r"rad/s|kVAR|kVA|dB|VAR|Hz|kHz|MHz|GHz|mA|kA|A|mV|kV|V|W|kW|MW|"
         r"J|mJ|F|mF|nF|pF|H|mH|uH|ohm|s|ms|us|ns")
_NUMBER = re.compile(r"^[(\[]?[+-]?\d+(?:[.,]\d+)?(?:[)\]])?$")
_IDENT = re.compile(r"^[(\[]?[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)?[)\],.;:]?$")
_NUM_UNIT = re.compile(r"^[+-]?\d+(?:\.\d+)?(?:%s)$" % _UNIT)
_RELATION_WORD = {"=", "≈", "≤", "≥", "≠", "∝", "+", "-", "*", "/", "^",
                  "→", "±", "∓", "×", "·"}


def _word_kind(w: str) -> str:
    """MATH, MAYBE (joins a run but cannot start one), or PROSE."""
    if not w:
        return "PROSE"
    if any(c in MATHY for c in w):
        return "MATH"
    if w in _RELATION_WORD or RELATION.search(w):
        return "MATH"
    if _NUM_UNIT.match(w):
        return "MATH"
    if _NUMBER.match(w) or _IDENT.match(w):
        return "MAYBE"
    return "PROSE"


# --------------------------------------------------------------------------
# Only WELL-DELIMITED spans are converted
# --------------------------------------------------------------------------
#
# An earlier version scanned prose word by word, grouping runs that looked
# mathematical. It produced output like
#
#     The **quadratic formula** solves any equation of the $form **ax^2 =$ 0**:
#
# because expression boundaries inside running prose are genuinely ambiguous
# at word level, and the scan happily swallowed markdown emphasis and list
# bullets. So this version converts only spans whose extent is already marked
# by the document: a bold span, a table cell, a whole line, or a single token.
# Anything else is left exactly as written.

_FUNCS = ("arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "sin", "cos",
          "tan", "cot", "sec", "csc", "log", "ln", "exp", "det", "max", "min",
          "lim", "sqrt")

_UNIT_WORD = ("rad", "deg", "sec", "kVAR", "kVA", "VAR", "Hz", "kHz", "MHz",
              "GHz", "ohm", "dB", "pf", "rms", "avg", "max", "min", "pk")


def _prose_words(s: str) -> list[str]:
    """Ordinary English words in s, ignoring anything that is legitimately
    part of an expression: function names, subscript and superscript contents,
    and unit words.

    Subscripts have to be stripped BEFORE counting or `V_base^2 / S_base` reads
    as two English words and gets rejected, which would leave every per-unit
    formula in the course as plain text.
    """
    t = re.sub(r"[_^]\{[^}]*\}", " ", s)      # braced sub/superscripts
    t = re.sub(r"[_^][A-Za-z0-9]+", " ", t)   # bare sub/superscripts
    for w in _FUNCS + _UNIT_WORD:
        t = re.sub(r"(?<![A-Za-z])%s(?![A-Za-z])" % re.escape(w), " ", t)
    words = re.findall(r"[A-Za-z]{3,}", t)
    # NPV, SNR, EIRP and friends are quantity names, not prose. Counting them
    # left equations half-converted: the acronym rejected the whole span, then
    # the single-token rule still fired inside it.
    return [w for w in words if not (w.isupper() and len(w) <= 5)]


def _is_expression(s: str) -> bool:
    """True when the whole of s is one mathematical expression."""
    s = s.strip()
    if len(s) < 2 or "\x00" in s:
        return False
    if not re.search(r"[A-Za-z0-9]", s):
        return False
    if not (RELATION.search(s) or any(c in MATHY for c in s)
            or re.search(r"\^|_\{|\b\d+\s*[/*]\s*\d+", s)
            or re.search(r"\b(?:%s)\s*\(" % "|".join(_FUNCS), s)):
        return False
    # ONE ordinary word is enough to reject. A threshold of two let through
    # "Reduces to 1/3", "pf = 0.866 lagging" and "differentiating 1/0", all of
    # which are sentences that happen to contain a number - and setting English
    # prose in italic serif is a worse defect than leaving an equation plain.
    if _prose_words(s):
        return False
    if s.count("$") or "✓" in s:
        return False
    # An IP address, a CIDR block or a version string satisfies the
    # digits-and-a-slash test while being nothing of the kind.
    if re.search(r"\d+\.\d+\.\d+", s):
        return False
    return True


def _tex_funcs(s: str) -> str:
    for f in _FUNCS:
        if f == "sqrt":
            continue
        # NOT \b after the name: digits are word characters, so cos2x would
        # not match and would render as the product c*o*s*2*x.
        s = re.sub(r"(?<![\\A-Za-z])%s(?![A-Za-z])" % f, "\\\\" + f + " ", s)
    s = re.sub(r"\s+([)\]};,])", r"\1", s)
    return s


def _wrap(core: str, display: bool = False) -> str:
    # Emphasis markers must not survive into the maths. A line such as
    #     dA/dt = 2*pi*r*dr/dt = **62.8 m^2/s**
    # is one expression with its result bolded, and wrapping it whole left the
    # asterisks inside $$...$$ where KaTeX renders them as literal characters.
    # Bold inside an equation carries nothing KaTeX cannot show anyway.
    core = core.replace("**", "")
    tex = _tex_funcs(to_tex(core))
    # These strings live inside TypeScript TEMPLATE LITERALS, where a lone
    # backslash is an identity escape: `\pm` evaluates to "pm". Every LaTeX
    # command therefore has to be written with a doubled backslash in the
    # source so the running app receives a single one. This is invisible in
    # the file and invisible to any checker that reads the file as text
    # rather than as JavaScript.
    tex = tex.replace("\\", "\\\\")
    return "$$%s$$" % tex if display else "$%s$" % tex


def _convert_line(line: str, in_table: bool = False) -> str:
    stripped = line.strip()

    # (1) a whole line that is one expression, optionally bolded -> display
    bare = stripped
    bold = False
    if bare.startswith("**") and bare.endswith("**") and bare.count("**") == 2:
        bare, bold = bare[2:-2].strip(), True
    tail = ""
    while bare and bare[-1] in ".,;:":
        tail, bare = bare[-1] + tail, bare[:-1]
    if bare and _is_expression(bare) and not stripped.startswith(("|", "#", "-", "*", ">")):
        indent = line[: len(line) - len(line.lstrip())]
        return "%s%s%s" % (indent, _wrap(bare, display=True), tail)

    # (2) table cells that are entirely an expression.
    #     |H(jw)|_dB = 20 log|H(jw)| also starts and ends with a pipe, but
    #     those are MAGNITUDE BARS. Treating that line as a table row split it
    #     into "cells" and mangled it. A real row has at least three pipes and
    #     no relation sign sitting between two of them.
    if in_table and stripped.startswith("|") and stripped.endswith("|"):
        cells = line.split("|")
        for k, cell in enumerate(cells):
            inner = cell.strip()
            b = False
            if inner.startswith("**") and inner.endswith("**") and inner.count("**") == 2:
                inner, b = inner[2:-2].strip(), True
            if _is_expression(inner):
                lead = cell[: len(cell) - len(cell.lstrip())] or " "
                new = _wrap(inner)
                cells[k] = "%s%s " % (lead, "**%s**" % new if b else new)
        return "|".join(cells)

    # (3) bold spans inside a sentence that are entirely an expression
    def bold_repl(m: re.Match) -> str:
        inner = m.group(1).strip()
        return "**%s**" % _wrap(inner) if _is_expression(inner) else m.group(0)

    line = re.sub(r"\*\*([^*]+)\*\*", bold_repl, line)

    # (4) single tokens carrying Unicode sub/superscripts or Greek letters,
    #     e.g. omega-zero or 10^-12, which are unambiguous on their own
    def token_repl(m: re.Match) -> str:
        tok = m.group(0)
        if "$" in tok or "\x00" in tok:
            return tok
        return _wrap(tok)

    line = re.sub(
        r"(?<![\w$\\])"
        r"(?:[A-Za-z][A-Za-z0-9]*|\d+(?:\.\d+)?)"
        r"[₀-₉⁰-⁹⁻⁺]+(?:[A-Za-z0-9]+)?"
        r"(?![\w$])", token_repl, line)

    return line


def convert_body(body: str) -> str:
    body, stash = _protect(body)
    lines = body.split("\n")
    # Mark the lines that belong to a real table: a run of pipe lines that
    # contains a |---|---| delimiter. |H(jw)| = ... is a magnitude, not a row.
    table_lines: set[str] = set()
    run: list[str] = []
    for ln in lines + [""]:
        if ln.strip().startswith("|"):
            run.append(ln)
            continue
        if any(re.fullmatch(r"\s*\|[\s:|-]+\|\s*", r) for r in run):
            table_lines.update(run)
        run = []
    out_lines = []
    for line in lines:
        # table delimiter rows are structure, never content
        if re.fullmatch(r"\s*\|[\s:|-]+\|\s*", line):
            out_lines.append(line)
            continue
        out_lines.append(_convert_line(line, line in table_lines))
    return _restore("\n".join(out_lines), stash)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--sample", type=int, default=30)
    args = ap.parse_args()

    src = DATA.read_text(encoding="utf-8")
    bodies = list(re.finditer(r"content: `(.*?)`,", src, re.S))
    changed, out, last = 0, [], 0
    samples = []
    for m in bodies:
        body = m.group(1)
        new = convert_body(body)
        if new != body:
            changed += 1
            for a, b in zip(body.split("\n"), new.split("\n")):
                if a != b and len(samples) < args.sample:
                    samples.append((a, b))
        out.append(src[last:m.start(1)])
        out.append(new)
        last = m.end(1)
    out.append(src[last:])
    result = "".join(out)

    print("content blocks: %d, changed: %d" % (len(bodies), changed))
    print("\nsample of changed lines:\n")
    for a, b in samples:
        print("  -", a[:150])
        print("  +", b[:150])
        print()

    if not args.dry:
        DATA.write_text(result, encoding="utf-8")
        print("written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
