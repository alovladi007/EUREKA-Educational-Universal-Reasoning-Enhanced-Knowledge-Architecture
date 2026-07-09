"""QTI 3.0 import and export for AXIOM assessment items.

Pure functions with no database and no web framework dependencies. Only the
Python standard library (xml.etree.ElementTree, json) is used, so this module can
be imported and exercised in isolation.

The AXIOM item dict shape converted to and from QTI is:

    {
        "identifier": str,        # stable id/code for the item
        "kind": str,              # any AXIOM item kind
        "prompt": str,            # the question text
        "options": list[str] | None,  # choices, else None
        "correct": str,           # kind-specific answer key (see below)
        "explanation": str,       # may be empty
    }

Mapping, by kind:

- mcq_single  -> choiceInteraction (maxChoices 1). correct is the option INDEX;
  it becomes the correct choice identifier and back.
- mcq_multi   -> choiceInteraction (maxChoices 0 = any), cardinality multiple.
  correct is a JSON list of indices; each becomes a correct choice identifier.
- true_false  -> choiceInteraction over fixed True/False choices. correct is
  "true"/"false" and maps to choice-0/choice-1.
- ordering    -> orderInteraction. correct is a JSON list; the ordered choice
  identifiers encode the position of each option.
- numeric, math_expression, equation, inequality, short_text, fraction,
  mixed_number, units_numeric, number_line -> textEntryInteraction. correct is
  the answer string.
- every other kind (matching, plot_*, show_work, counterexample, proof kinds,
  ...) -> a textEntryInteraction CARRIER: the correct string is stored verbatim.

Loss-free round-trip: the AXIOM kind is stored as an axiom-kind attribute and is
authoritative on import, and options are carried in an axiom-options companion
element as JSON, so any item -- including kinds without a native QTI interaction
-- exports and re-imports without loss. The explanation round-trips in a
companion element too.
"""

from __future__ import annotations

import json
import xml.etree.ElementTree as ET

QTI_NS = "http://www.imsglobal.org/xsd/imsqti_v3p0"

RESPONSE_IDENTIFIER = "RESPONSE"

MCQ_SINGLE = "mcq_single"
MCQ_MULTI = "mcq_multi"
TRUE_FALSE = "true_false"
ORDERING = "ordering"
# Kinds whose answer key is a plain string and map to a text-entry interaction.
TEXT_KINDS = (
    "numeric",
    "math_expression",
    "equation",
    "inequality",
    "short_text",
    "fraction",
    "mixed_number",
    "units_numeric",
    "number_line",
)

_CHOICE_PREFIX = "choice-"
_TF_CHOICES = ("True", "False")


def _q(tag: str) -> str:
    return f"{{{QTI_NS}}}{tag}"


def _local(tag: str) -> str:
    if tag.startswith("{"):
        return tag.split("}", 1)[1]
    return tag


def _choice_id(index: int) -> str:
    return f"{_CHOICE_PREFIX}{index}"


def _index_from_choice_id(choice_id: str) -> str:
    if choice_id.startswith(_CHOICE_PREFIX):
        return choice_id[len(_CHOICE_PREFIX):]
    return choice_id


def _parse_index_list(raw: str) -> list[int]:
    """Parse a JSON or comma-separated list of indices to a list of ints."""
    raw = (raw or "").strip()
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [int(x) for x in parsed]
    except (ValueError, TypeError):
        pass
    tokens = raw.replace(";", ",").split(",")
    return [int(tok) for tok in tokens if tok.strip().lstrip("-").isdigit()]


# --------------------------------------------------------------------------
# Build (AXIOM -> QTI)
# --------------------------------------------------------------------------


def _build_assessment_item(item: dict) -> ET.Element:
    identifier = item["identifier"]
    kind = item["kind"]
    prompt = item.get("prompt", "")
    explanation = item.get("explanation", "")
    options = item.get("options")
    correct = item.get("correct", "")

    root = ET.Element(_q("assessmentItem"))
    root.set("identifier", identifier)
    root.set("title", identifier)
    root.set("adaptive", "false")
    root.set("timeDependent", "false")
    root.set("axiom-kind", kind)

    if kind == MCQ_SINGLE:
        _decl_choice(root, "single", [_choice_id(int(correct))])
    elif kind == MCQ_MULTI:
        _decl_choice(root, "multiple", [_choice_id(i) for i in _parse_index_list(str(correct))])
    elif kind == TRUE_FALSE:
        idx = 0 if str(correct).strip().lower() in ("true", "t", "1") else 1
        _decl_choice(root, "single", [_choice_id(idx)])
    elif kind == ORDERING:
        order = _order_list(correct)
        _decl_choice(root, "ordered", [_choice_id(i) for i in range(len(order))])
    else:
        _decl_text(root, str(correct))

    body = ET.SubElement(root, _q("itemBody"))
    prompt_el = ET.SubElement(body, _q("p"))
    prompt_el.set("class", "axiom-prompt")
    prompt_el.text = prompt

    if kind == MCQ_SINGLE:
        _choice_interaction(body, options or [], max_choices=1)
    elif kind == MCQ_MULTI:
        _choice_interaction(body, options or [], max_choices=0)
    elif kind == TRUE_FALSE:
        _choice_interaction(body, list(_TF_CHOICES), max_choices=1)
    elif kind == ORDERING:
        _order_interaction(body, _order_list(correct))
    else:
        _text_interaction(body)

    companion = ET.SubElement(body, _q("qti-companion"))
    expl_el = ET.SubElement(companion, _q("explanation"))
    expl_el.text = explanation
    # Carry options verbatim so every kind round-trips exactly.
    if options is not None:
        opts_el = ET.SubElement(companion, _q("axiom-options"))
        opts_el.text = json.dumps(options)

    return root


def _order_list(correct: str) -> list:
    try:
        parsed = json.loads(correct)
        return parsed if isinstance(parsed, list) else []
    except (ValueError, TypeError):
        return []


def _decl_choice(root: ET.Element, cardinality: str, value_ids: list[str]) -> None:
    decl = ET.SubElement(root, _q("responseDeclaration"))
    decl.set("identifier", RESPONSE_IDENTIFIER)
    decl.set("cardinality", cardinality)
    decl.set("baseType", "identifier")
    correct_response = ET.SubElement(decl, _q("correctResponse"))
    for vid in value_ids:
        value = ET.SubElement(correct_response, _q("value"))
        value.text = vid


def _decl_text(root: ET.Element, correct: str) -> None:
    decl = ET.SubElement(root, _q("responseDeclaration"))
    decl.set("identifier", RESPONSE_IDENTIFIER)
    decl.set("cardinality", "single")
    decl.set("baseType", "string")
    correct_response = ET.SubElement(decl, _q("correctResponse"))
    value = ET.SubElement(correct_response, _q("value"))
    value.text = correct


def _choice_interaction(body: ET.Element, options: list[str], max_choices: int) -> None:
    interaction = ET.SubElement(body, _q("choiceInteraction"))
    interaction.set("responseIdentifier", RESPONSE_IDENTIFIER)
    interaction.set("maxChoices", str(max_choices))
    interaction.set("shuffle", "false")
    for index, text in enumerate(options):
        choice = ET.SubElement(interaction, _q("simpleChoice"))
        choice.set("identifier", _choice_id(index))
        choice.text = str(text)


def _order_interaction(body: ET.Element, items: list) -> None:
    interaction = ET.SubElement(body, _q("orderInteraction"))
    interaction.set("responseIdentifier", RESPONSE_IDENTIFIER)
    interaction.set("shuffle", "true")
    for index, text in enumerate(items):
        choice = ET.SubElement(interaction, _q("simpleChoice"))
        choice.set("identifier", _choice_id(index))
        choice.text = str(text)


def _text_interaction(body: ET.Element) -> None:
    interaction = ET.SubElement(body, _q("textEntryInteraction"))
    interaction.set("responseIdentifier", RESPONSE_IDENTIFIER)


def _serialize(root: ET.Element) -> str:
    ET.register_namespace("", QTI_NS)
    body = ET.tostring(root, encoding="unicode")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + body


def item_to_qti(item: dict) -> str:
    return _serialize(_build_assessment_item(item))


# --------------------------------------------------------------------------
# Parse (QTI -> AXIOM)
# --------------------------------------------------------------------------


def _find_first(parent: ET.Element, local_name: str) -> ET.Element | None:
    for child in parent.iter():
        if _local(child.tag) == local_name:
            return child
    return None


def _text_of(el: ET.Element | None) -> str:
    if el is None or el.text is None:
        return ""
    return el.text


def _choice_texts(root: ET.Element, tag: str) -> list[str]:
    interaction = _find_first(root, tag)
    if interaction is None:
        return []
    return [_text_of(c) for c in interaction if _local(c.tag) == "simpleChoice"]


def _correct_value_ids(root: ET.Element) -> list[str]:
    decl = _find_first(root, "responseDeclaration")
    if decl is None:
        return []
    cr = _find_first(decl, "correctResponse")
    if cr is None:
        return []
    return [_text_of(v) for v in cr if _local(v.tag) == "value"]


def _parse_assessment_item(root: ET.Element) -> dict:
    identifier = root.get("identifier", "")
    kind = root.get("axiom-kind") or _infer_kind(root)

    prompt = ""
    explanation = ""
    options_json = None
    for el in root.iter():
        name = _local(el.tag)
        if name == "p" and el.get("class") == "axiom-prompt":
            prompt = _text_of(el)
        elif name == "explanation":
            explanation = _text_of(el)
        elif name == "axiom-options":
            options_json = _text_of(el)

    options: list | None = None
    if options_json:
        try:
            parsed = json.loads(options_json)
            if isinstance(parsed, list):
                options = parsed
        except (ValueError, TypeError):
            options = None

    if kind == MCQ_SINGLE:
        if options is None:
            options = _choice_texts(root, "choiceInteraction")
        ids = _correct_value_ids(root)
        correct = _index_from_choice_id(ids[0]) if ids else ""
    elif kind == MCQ_MULTI:
        if options is None:
            options = _choice_texts(root, "choiceInteraction")
        indices = [int(_index_from_choice_id(v)) for v in _correct_value_ids(root)]
        correct = json.dumps(sorted(indices))
    elif kind == TRUE_FALSE:
        ids = _correct_value_ids(root)
        correct = "true" if ids and _index_from_choice_id(ids[0]) == "0" else "false"
        options = None
    elif kind == ORDERING:
        # The correct order is the simpleChoice order in the orderInteraction.
        correct = json.dumps(_choice_texts(root, "orderInteraction"))
        options = None
    else:
        # Every text and carrier kind: the answer key is the stored string value;
        # options (for carrier kinds like matching) come from the companion.
        value = _correct_value_ids(root)
        correct = value[0] if value else ""
        if kind in TEXT_KINDS:
            options = None

    return {
        "identifier": identifier,
        "kind": kind,
        "prompt": prompt,
        "options": options,
        "correct": correct,
        "explanation": explanation,
    }


def _infer_kind(root: ET.Element) -> str:
    if _find_first(root, "choiceInteraction") is not None:
        return MCQ_SINGLE
    if _find_first(root, "orderInteraction") is not None:
        return ORDERING
    return "numeric"


def qti_to_item(xml: str) -> dict:
    root = ET.fromstring(xml)
    if _local(root.tag) != "assessmentItem":
        found = _find_first(root, "assessmentItem")
        if found is None:
            raise ValueError("no assessmentItem element found in XML")
        root = found
    return _parse_assessment_item(root)


def bank_to_qti(items: list[dict]) -> str:
    root = ET.Element(_q("qti-item-bank"))
    for item in items:
        root.append(_build_assessment_item(item))
    return _serialize(root)


def qti_to_bank(xml: str) -> list[dict]:
    root = ET.fromstring(xml)
    items: list[dict] = []
    for child in root:
        if _local(child.tag) == "assessmentItem":
            items.append(_parse_assessment_item(child))
    return items
