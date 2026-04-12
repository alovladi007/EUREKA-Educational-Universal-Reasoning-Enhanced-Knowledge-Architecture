"""
D8-03 — DevSecOps Pipeline with Security Gates
Run: manim -pql devsecops_pipeline.py DevSecOpsPipeline
"""
from manim import *


class DevSecOpsPipeline(Scene):
    def construct(self):
        title = Text("DevSecOps Pipeline", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))
        subtitle = Text("Security integrated at every stage", font_size=20, color=GREY).next_to(title, DOWN, buff=0.1)
        self.play(Write(subtitle))

        stages = [
            ("Pre-commit", TEAL, ["IDE linters", "Local SAST"]),
            ("Commit", GREEN, ["Secret scanning", "SCA", "Fast SAST"]),
            ("Build", BLUE, ["Full SAST", "Container scan", "SBOM", "IaC scan"]),
            ("Test", YELLOW, ["DAST", "IAST", "Security tests"]),
            ("Pre-deploy", ORANGE, ["Compliance check", "Approval gate"]),
            ("Runtime", RED, ["RASP / WAF", "Monitoring", "Anomaly detection"]),
        ]

        # Create pipeline stages
        stage_boxes = VGroup()
        for name, color, tools in stages:
            box = VGroup(
                RoundedRectangle(width=1.8, height=2.5, corner_radius=0.1,
                                  color=color, fill_opacity=0.15),
            )
            name_text = Text(name, font_size=12, color=color, weight=BOLD)
            name_text.move_to(box[0].get_top() + DOWN * 0.25)

            tools_group = VGroup()
            for tool in tools:
                t = Text(f"• {tool}", font_size=9, color=WHITE)
                tools_group.add(t)
            tools_group.arrange(DOWN, aligned_edge=LEFT, buff=0.04)
            tools_group.next_to(name_text, DOWN, buff=0.15)

            box.add(name_text, tools_group)
            stage_boxes.add(box)

        stage_boxes.arrange(RIGHT, buff=0.2).move_to(ORIGIN + DOWN * 0.3)
        stage_boxes.scale_to_fit_width(12)

        # Animate stages appearing with arrows
        for i, box in enumerate(stage_boxes):
            self.play(FadeIn(box), run_time=0.5)
            if i < len(stage_boxes) - 1:
                arrow = Arrow(
                    box.get_right(),
                    stage_boxes[i + 1].get_left(),
                    buff=0.05,
                    color=GREY,
                    stroke_width=2,
                    max_tip_length_to_length_ratio=0.15,
                )
                self.play(Create(arrow), run_time=0.2)

        self.wait(1.5)

        # Gate behavior
        gate_text = VGroup(
            Text("Gate Behavior:", font_size=20, color=YELLOW, weight=BOLD),
            Text("Critical findings → BLOCK the build", font_size=18, color=RED),
            Text("Medium findings → Create ticket, don't block", font_size=18, color=ORANGE),
            Text("Low findings → Trend analysis only", font_size=18, color=GREY),
        ).arrange(DOWN, buff=0.1).to_edge(DOWN, buff=0.3)

        self.play(FadeIn(gate_text))
        self.wait(2)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("Shift left for SPEED", font_size=28, color=GREEN),
            Text("Catch issues early when they're cheap to fix", font_size=20, color=GREEN),
            Text("", font_size=8),
            Text("Shift everywhere for DEPTH", font_size=28, color=RED),
            Text("No single stage catches everything", font_size=20, color=RED),
            Text("", font_size=8),
            Text("Tools: SAST, DAST, IAST, SCA, RASP,", font_size=20, color=YELLOW),
            Text("secret scanning, container scanning, IaC scanning", font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.1).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
