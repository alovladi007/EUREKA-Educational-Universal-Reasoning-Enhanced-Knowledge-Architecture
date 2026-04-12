"""
D1-02 — The (ISC)² Code of Ethics Canons in Priority Order
Run: manim -pql ethics_canons.py EthicsCanons
"""
from manim import *


class EthicsCanons(Scene):
    def construct(self):
        title = Text("(ISC)² Code of Ethics", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        canons = [
            ("I", "Protect society, the common good,\nnecessary public trust and confidence,\nand the infrastructure", BLUE),
            ("II", "Act honorably, honestly, justly,\nresponsibly, and legally", GREEN),
            ("III", "Provide diligent and competent\nservice to principals", YELLOW),
            ("IV", "Advance and protect\nthe profession", ORANGE),
        ]

        # Show horizontally first
        cards = VGroup()
        for num, text, color in canons:
            card = VGroup(
                RoundedRectangle(width=2.8, height=2, corner_radius=0.1,
                                  color=color, fill_opacity=0.15),
                Text(f"Canon {num}", font_size=16, color=color, weight=BOLD),
                Text(text, font_size=11, color=WHITE),
            )
            card[1].move_to(card[0].get_top() + DOWN * 0.3)
            card[2].move_to(card[0].get_center() + DOWN * 0.1)
            cards.add(card)

        cards.arrange(RIGHT, buff=0.2).move_to(ORIGIN)
        cards.scale_to_fit_width(12)

        for card in cards:
            self.play(FadeIn(card), run_time=0.5)
        self.wait(1)

        # Stack vertically to show priority
        self.play(
            cards.animate.arrange(DOWN, buff=0.15).move_to(LEFT * 2 + DOWN * 0.3).scale_to_fit_height(5),
            run_time=1.5
        )

        # Priority arrow
        priority_arrow = Arrow(UP * 2.5 + RIGHT * 2, DOWN * 2.5 + RIGHT * 2,
                                color=RED, stroke_width=3)
        priority_label = Text("PRIORITY\nORDER", font_size=18, color=RED, weight=BOLD).next_to(priority_arrow, RIGHT, buff=0.2)
        highest = Text("Highest", font_size=14, color=RED).next_to(priority_arrow.get_start(), RIGHT, buff=0.1)
        lowest = Text("Lowest", font_size=14, color=RED).next_to(priority_arrow.get_end(), RIGHT, buff=0.1)

        self.play(Create(priority_arrow), Write(priority_label), Write(highest), Write(lowest))
        self.wait(1.5)

        # Scenario
        self.play(*[FadeOut(m) for m in self.mobjects])

        scenario_title = Text("Scenario: Employer asks you to conceal a breach", font_size=22, color=YELLOW).to_edge(UP)
        self.play(Write(scenario_title))

        conflict = VGroup(
            Text("Canon III says: serve your principal (employer)", font_size=20, color=YELLOW),
            Text("Canon I says: protect society and public trust", font_size=20, color=BLUE),
            Text("", font_size=8),
            Text("Canon I > Canon III", font_size=28, color=BLUE, weight=BOLD),
            Text("Society wins. Always.", font_size=24, color=BLUE),
            Text("", font_size=8),
            Text("Correct action: escalate internally first,", font_size=20, color=GREEN),
            Text("then to authorities if internal channels fail.", font_size=20, color=GREEN),
        ).arrange(DOWN, buff=0.12).move_to(ORIGIN)

        for line in conflict:
            self.play(FadeIn(line), run_time=0.4)
        self.wait(2)

        # Memory hook
        self.play(*[FadeOut(m) for m in self.mobjects])
        memory = VGroup(
            Text("Memory Hook: S-P-S-P", font_size=30, color=BLUE, weight=BOLD),
            Text("Society > Probity > Service > Profession", font_size=24, color=YELLOW),
            Text("", font_size=8),
            Text("Complaint Standing: A-A-P-L", font_size=24, color=GREEN),
            Text("Anyone (I) · Anyone first-hand (II) ·", font_size=20),
            Text("Principal only (III) · Licensed only (IV)", font_size=20),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(memory))
        self.wait(3)
