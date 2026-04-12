"""
D8-01 — OWASP Top 10 (2021) in 90 seconds
Run: manim -pql owasp_top10.py OWASPTop10
"""
from manim import *


class OWASPTop10(Scene):
    def construct(self):
        title = Text("OWASP Top 10 (2021)", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        items = [
            ("A01", "Broken Access Control", RED, "Authorization not enforced"),
            ("A02", "Cryptographic Failures", ORANGE, "Weak crypto, missing encryption"),
            ("A03", "Injection", YELLOW, "SQL, command, LDAP injection"),
            ("A04", "Insecure Design", GREEN_B, "Design-time flaws"),
            ("A05", "Security Misconfiguration", TEAL, "Defaults, unnecessary features"),
            ("A06", "Vulnerable Components", BLUE, "Outdated dependencies"),
            ("A07", "Auth Failures", PURPLE, "Weak authentication/sessions"),
            ("A08", "Integrity Failures", PINK, "Unverified updates, deserialization"),
            ("A09", "Logging Failures", GREY, "Insufficient detection"),
            ("A10", "SSRF", MAROON, "Server-side request forgery"),
        ]

        # Display as animated list
        entries = VGroup()
        for code, name, color, desc in items:
            row = VGroup(
                Text(code, font_size=18, color=color, weight=BOLD),
                Text(name, font_size=16, color=WHITE),
                Text(f"— {desc}", font_size=13, color=GREY),
            ).arrange(RIGHT, buff=0.3)
            entries.add(row)

        entries.arrange(DOWN, aligned_edge=LEFT, buff=0.12).move_to(ORIGIN + DOWN * 0.3)
        entries.scale_to_fit_height(5.5)

        for entry in entries:
            self.play(FadeIn(entry), run_time=0.35)

        self.wait(2)

        # Highlight top 3
        self.play(*[FadeOut(m) for m in self.mobjects])

        focus_title = Text("Most Critical Three", font_size=30, color=RED).to_edge(UP)
        self.play(Write(focus_title))

        focus_items = VGroup(
            VGroup(
                Text("A01: Broken Access Control", font_size=24, color=RED, weight=BOLD),
                Text("Defense: Server-side enforcement, deny by default,\nreject unauthorized object references", font_size=18),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.1),
            VGroup(
                Text("A03: Injection", font_size=24, color=YELLOW, weight=BOLD),
                Text("Defense: Parameterized queries — NEVER string\nconcatenation. Allowlist input validation.", font_size=18),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.1),
            VGroup(
                Text("A06: Vulnerable Components", font_size=24, color=BLUE, weight=BOLD),
                Text("Defense: SCA scanning, SBOM tracking,\ndependency patching, private registries.", font_size=18),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.1),
        ).arrange(DOWN, buff=0.4).move_to(ORIGIN + DOWN * 0.3)

        for item in focus_items:
            self.play(FadeIn(item), run_time=0.7)
            self.wait(1)

        self.wait(2)

        # Final
        self.play(*[FadeOut(m) for m in self.mobjects])
        final = VGroup(
            Text("These 10 categories cover ~95% of", font_size=24),
            Text("real-world web application attacks.", font_size=24),
            Text("Memorize them.", font_size=28, color=YELLOW, weight=BOLD),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN)
        self.play(FadeIn(final))
        self.wait(2)
