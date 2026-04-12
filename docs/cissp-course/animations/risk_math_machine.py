"""
D1-05 — Risk Math Machine: AV → EF → SLE → ARO → ALE
Manim Community Edition script. Run: manim -pql risk_math_machine.py RiskMathMachine

Storyboard: docs/cissp-course/domain-1/03-storyboards.md §D1-05
"""
from manim import *


class RiskMathMachine(Scene):
    def construct(self):
        title = Text("Risk Math Machine", font_size=40, color=BLUE).to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Step 1: Show the formulas
        formulas = VGroup(
            MathTex(r"\text{SLE} = \text{AV} \times \text{EF}", font_size=36),
            MathTex(r"\text{ALE} = \text{SLE} \times \text{ARO}", font_size=36),
            MathTex(r"\text{ROSI} = \frac{\text{ALE}_{\text{before}} - \text{ALE}_{\text{after}} - \text{Cost}}{\text{Cost}}", font_size=32),
        ).arrange(DOWN, buff=0.4).next_to(title, DOWN, buff=0.5)

        for f in formulas:
            self.play(Write(f), run_time=1)
        self.wait(1)
        self.play(FadeOut(formulas))

        # Step 2: Scenario
        scenario = VGroup(
            Text("Scenario:", font_size=28, color=YELLOW),
            Text("1,000 laptops × $1,500 each", font_size=24),
            Text("2% lost/stolen per year (ARO = 0.02)", font_size=24),
            Text("100% loss per incident (EF = 1.0)", font_size=24),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(scenario), run_time=1)
        self.wait(2)

        # Step 3: Pipeline boxes
        self.play(FadeOut(scenario))

        boxes = VGroup()
        labels = ["AV\n$1,500", "× EF\n1.0", "= SLE\n$1,500", "× ARO\n0.02", "= ALE\n$30"]
        colors = [BLUE, ORANGE, GREEN, ORANGE, RED]

        for i, (label, color) in enumerate(zip(labels, colors)):
            box = VGroup(
                RoundedRectangle(corner_radius=0.15, width=2.2, height=1.4,
                                 fill_color=color, fill_opacity=0.2, stroke_color=color),
                Text(label, font_size=20, color=WHITE),
            )
            box[1].move_to(box[0])
            boxes.add(box)

        boxes.arrange(RIGHT, buff=0.3).move_to(ORIGIN + UP * 0.5)

        # Animate pipeline
        for i, box in enumerate(boxes):
            self.play(FadeIn(box), run_time=0.5)
            if i < len(boxes) - 1:
                arrow = Arrow(box.get_right(), boxes[i + 1].get_left(),
                              buff=0.1, color=GREY)
                self.play(Create(arrow), run_time=0.3)
        self.wait(1)

        # Step 4: Fleet ALE
        fleet = Text("Fleet ALE = $30 × 1,000 = $30,000/year",
                      font_size=28, color=RED).next_to(boxes, DOWN, buff=0.8)
        self.play(Write(fleet))
        self.wait(1.5)

        # Step 5: Control scenario
        self.play(FadeOut(boxes), FadeOut(fleet))

        control_text = VGroup(
            Text("Control: Full-Disk Encryption @ $50/laptop/year", font_size=24, color=YELLOW),
            Text("New EF = 10% (data protected, device still lost)", font_size=22),
            Text("New SLE = $1,500 × 0.1 = $150", font_size=22),
            Text("New ALE = $150 × 0.02 = $3/laptop", font_size=22),
            Text("Fleet ALE (after) = $3,000/year", font_size=22, color=GREEN),
            Text("Control cost = $50,000/year", font_size=22),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).move_to(ORIGIN + UP * 0.5)

        for line in control_text:
            self.play(FadeIn(line), run_time=0.5)
        self.wait(1)

        # Step 6: ROSI
        self.play(FadeOut(control_text))
        rosi = VGroup(
            MathTex(r"\text{ROSI} = \frac{\$30{,}000 - \$3{,}000 - \$50{,}000}{\$50{,}000}", font_size=32),
            MathTex(r"= \frac{-\$23{,}000}{\$50{,}000} = -0.46", font_size=32, color=RED),
            Text("Control NOT justified on pure financial grounds", font_size=24, color=RED),
        ).arrange(DOWN, buff=0.4).move_to(ORIGIN)

        self.play(Write(rosi[0]))
        self.wait(0.5)
        self.play(Write(rosi[1]))
        self.wait(0.5)
        self.play(Write(rosi[2]))
        self.wait(1)

        # Step 7: But...
        caveat = VGroup(
            Text("But: regulatory, reputational, and ethical factors", font_size=22, color=YELLOW),
            Text("may justify a control that looks unjustifiable on a spreadsheet.", font_size=22, color=YELLOW),
        ).arrange(DOWN, buff=0.1).next_to(rosi, DOWN, buff=0.6)
        self.play(FadeIn(caveat))
        self.wait(2)

        # Final summary
        self.play(FadeOut(rosi), FadeOut(caveat), FadeOut(title))
        summary = VGroup(
            MathTex(r"\text{SLE} = \text{AV} \times \text{EF}", font_size=36),
            MathTex(r"\text{ALE} = \text{SLE} \times \text{ARO}", font_size=36),
            MathTex(r"\text{ROSI} = \frac{\Delta\text{ALE} - \text{Cost}}{\text{Cost}}", font_size=36),
            Text("Memorize three formulas. Every risk question becomes mechanical.",
                 font_size=24, color=BLUE),
        ).arrange(DOWN, buff=0.3).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
