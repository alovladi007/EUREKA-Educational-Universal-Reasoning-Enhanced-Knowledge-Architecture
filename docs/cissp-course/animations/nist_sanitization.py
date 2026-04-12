"""
D2-05 — NIST SP 800-88: Clear / Purge / Destroy
Run: manim -pql nist_sanitization.py NISTSanitization
"""
from manim import *


class NISTSanitization(Scene):
    def construct(self):
        title = Text("NIST SP 800-88: Media Sanitization", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Three levels as a ladder
        levels = [
            ("CLEAR", GREEN, "Overwrite data", "Standard tools can't recover",
             "Low-classification data\nstaying in the org"),
            ("PURGE", YELLOW, "Crypto-erase or degauss", "Lab techniques can't recover",
             "Moderate classification\nor leaving the org"),
            ("DESTROY", RED, "Shred, incinerate, pulverize", "Media cannot be reused",
             "Highest classification\nor damaged media"),
        ]

        ladder = VGroup()
        for i, (name, color, method, resistance, use_case) in enumerate(levels):
            box = RoundedRectangle(width=10, height=1.5, corner_radius=0.1,
                                    color=color, fill_opacity=0.1 + i * 0.08)
            name_text = Text(name, font_size=22, color=color, weight=BOLD)
            name_text.move_to(box.get_left() + RIGHT * 1.2)
            method_text = Text(method, font_size=16, color=WHITE)
            method_text.move_to(box.get_center() + LEFT * 0.5)
            resistance_text = Text(resistance, font_size=14, color=GREY)
            resistance_text.move_to(box.get_center() + RIGHT * 2.5)

            group = VGroup(box, name_text, method_text, resistance_text)
            ladder.add(group)

        ladder.arrange(DOWN, buff=0.15).move_to(ORIGIN)

        # Cost/assurance arrow on the side
        cost_arrow = Arrow(DOWN * 1.5 + LEFT * 5.5, UP * 1.5 + LEFT * 5.5, color=GREY, stroke_width=2)
        cost_label = Text("Cost &\nAssurance", font_size=12, color=GREY).next_to(cost_arrow, LEFT, buff=0.1)

        self.play(FadeIn(cost_arrow), Write(cost_label))
        for group in ladder:
            self.play(FadeIn(group), run_time=0.7)
        self.wait(1.5)

        # Key facts
        self.play(*[FadeOut(m) for m in self.mobjects])

        facts = VGroup(
            Text("Key Facts for the Exam:", font_size=28, color=BLUE, weight=BOLD),
            Text("", font_size=8),
            Text("• SSD crypto-erase = PURGE (when properly implemented)", font_size=20, color=GREEN),
            Text("• Degaussing does NOT work on SSDs (no magnetic media)", font_size=20, color=RED),
            Text("• Delete ≠ Clear (delete only unlinks the file entry)", font_size=20, color=RED),
            Text("• Reformat ≠ Clear (rewrites filesystem table only)", font_size=20, color=RED),
            Text("• Always produce a certificate of destruction", font_size=20, color=YELLOW),
            Text("", font_size=8),
            Text("Match the method to:", font_size=22, color=WHITE),
            Text("  Media type × Classification × Destination", font_size=20, color=GREY),
        ).arrange(DOWN, buff=0.12).move_to(ORIGIN)

        for line in facts:
            self.play(FadeIn(line), run_time=0.35)
        self.wait(3)
