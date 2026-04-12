"""
D1-06 — Risk Treatment Compass: Avoid / Mitigate / Transfer / Accept
Run: manim -pql risk_treatment_compass.py RiskTreatmentCompass
"""
from manim import *
import numpy as np


class RiskTreatmentCompass(Scene):
    def construct(self):
        title = Text("Risk Treatment Compass", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Draw compass
        circle = Circle(radius=2, color=GREY, stroke_width=2)
        center_dot = Dot(ORIGIN, color=WHITE, radius=0.08)
        risk_label = Text("RISK", font_size=16, color=WHITE).move_to(ORIGIN + DOWN * 0.3)

        self.play(Create(circle), FadeIn(center_dot), Write(risk_label))

        # Four cardinal directions
        treatments = [
            ("Avoid", UP, RED, "Discontinue\nthe activity"),
            ("Mitigate", RIGHT, GREEN, "Apply controls\nto reduce"),
            ("Transfer", DOWN, YELLOW, "Shift financial\nconsequence"),
            ("Accept", LEFT, BLUE, "Acknowledge\nand document"),
        ]

        treatment_objs = []
        for name, direction, color, desc in treatments:
            pos = direction * 2.5
            label = Text(name, font_size=22, color=color, weight=BOLD).move_to(pos)
            desc_text = Text(desc, font_size=12, color=GREY).next_to(label, direction * 0.5, buff=0.1)
            arrow = Arrow(ORIGIN, direction * 1.7, buff=0.15, color=color, stroke_width=3)
            treatment_objs.append((label, desc_text, arrow))

        for label, desc, arrow in treatment_objs:
            self.play(Create(arrow), Write(label), FadeIn(desc), run_time=0.7)
        self.wait(1)

        # Scenario 1: Risk above capacity → Avoid
        self.play(*[FadeOut(m) for _, _, m in treatment_objs],
                  *[FadeOut(m) for m, _, _ in treatment_objs],
                  *[FadeOut(m) for _, m, _ in treatment_objs])

        needle = Arrow(ORIGIN, UP * 1.7, buff=0.1, color=RED, stroke_width=4)
        scenario1 = Text("Feature creates GDPR risk above capacity", font_size=18, color=YELLOW).to_edge(DOWN, buff=1.5)
        result1 = Text("→ AVOID: feature doesn't ship", font_size=20, color=RED).next_to(scenario1, DOWN, buff=0.2)

        for label, desc, arrow in treatment_objs:
            self.play(FadeIn(label), run_time=0.2)
        self.play(Create(needle), Write(scenario1), Write(result1))
        self.wait(1.5)

        # Scenario 2: Phishing → Mitigate
        self.play(FadeOut(scenario1), FadeOut(result1))
        self.play(Rotate(needle, -PI/2, about_point=ORIGIN))
        scenario2 = Text("Phishing is the top threat", font_size=18, color=YELLOW).to_edge(DOWN, buff=1.5)
        result2 = Text("→ MITIGATE: MFA + training + DLP", font_size=20, color=GREEN).next_to(scenario2, DOWN, buff=0.2)
        self.play(Write(scenario2), Write(result2))
        self.wait(1.5)

        # Scenario 3: Tail risk → Transfer
        self.play(FadeOut(scenario2), FadeOut(result2))
        self.play(Rotate(needle, -PI/2, about_point=ORIGIN))
        scenario3 = Text("Catastrophic breach tail risk", font_size=18, color=YELLOW).to_edge(DOWN, buff=1.5)
        result3 = Text("→ TRANSFER: cyber insurance", font_size=20, color=YELLOW).next_to(scenario3, DOWN, buff=0.2)
        self.play(Write(scenario3), Write(result3))
        self.wait(1.5)

        # Scenario 4: $50 risk → Accept
        self.play(FadeOut(scenario3), FadeOut(result3))
        self.play(Rotate(needle, -PI/2, about_point=ORIGIN))
        scenario4 = Text("$50 risk, documented, signed off", font_size=18, color=YELLOW).to_edge(DOWN, buff=1.5)
        result4 = Text("→ ACCEPT: formal sign-off", font_size=20, color=BLUE).next_to(scenario4, DOWN, buff=0.2)
        self.play(Write(scenario4), Write(result4))
        self.wait(1.5)

        # "Ignore" with red X
        self.play(*[FadeOut(m) for m in self.mobjects])
        ignore = Text("IGNORE", font_size=40, color=GREY)
        red_x = Cross(scale_factor=1.5, color=RED, stroke_width=8).move_to(ignore)
        ignore_label = Text("Ignore is NOT a valid treatment", font_size=22, color=RED).next_to(ignore, DOWN, buff=0.5)
        self.play(Write(ignore), Create(red_x), Write(ignore_label))
        self.wait(1)

        # Priority order
        self.play(FadeOut(ignore), FadeOut(red_x), FadeOut(ignore_label))
        order = VGroup(
            Text("Treatment Priority Order:", font_size=26, color=BLUE, weight=BOLD),
            Text("1. Mitigate down to risk appetite", font_size=22, color=GREEN),
            Text("2. Transfer residual if economically sensible", font_size=22, color=YELLOW),
            Text("3. Accept what remains (documented)", font_size=22, color=BLUE),
            Text("4. Avoid if risk exceeds capacity", font_size=22, color=RED),
        ).arrange(DOWN, buff=0.25).move_to(ORIGIN)
        self.play(FadeIn(order))
        self.wait(3)
