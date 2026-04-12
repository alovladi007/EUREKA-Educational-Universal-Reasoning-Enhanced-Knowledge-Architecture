"""
D7-01 — NIST Incident Response Lifecycle (4 phases)
Run: manim -pql nist_ir_lifecycle.py NISTIRLifecycle
"""
from manim import *
import numpy as np


class NISTIRLifecycle(Scene):
    def construct(self):
        title = Text("NIST SP 800-61: IR Lifecycle", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Four phases as boxes in a cycle
        phases = [
            ("1. Preparation", GREEN, "Policy, team, tools,\ntraining, exercises"),
            ("2. Detection &\n    Analysis", YELLOW, "Identify incident,\ntriage severity"),
            ("3. Containment,\n    Eradication,\n    Recovery", RED, "Stop spread, remove\nthreat, restore ops"),
            ("4. Lessons\n    Learned", PURPLE, "Debrief, update,\nimprove the program"),
        ]

        positions = [UP * 1.5, RIGHT * 3.5, DOWN * 1.5, LEFT * 3.5]
        phase_objs = []

        for (name, color, desc), pos in zip(phases, positions):
            box = RoundedRectangle(width=3, height=1.8, corner_radius=0.15,
                                    color=color, fill_opacity=0.15)
            box.move_to(pos)
            name_text = Text(name, font_size=14, color=color, weight=BOLD)
            name_text.move_to(box.get_center() + UP * 0.3)
            desc_text = Text(desc, font_size=11, color=GREY)
            desc_text.move_to(box.get_center() + DOWN * 0.3)
            phase_objs.append((box, name_text, desc_text))

        # Animate phases appearing
        for box, name, desc in phase_objs:
            self.play(FadeIn(box), Write(name), FadeIn(desc), run_time=0.7)

        # Arrows between phases (clockwise)
        arrows = []
        for i in range(4):
            start = phase_objs[i][0].get_edge_center(
                [RIGHT, DOWN, LEFT, UP][i]
            )
            end = phase_objs[(i + 1) % 4][0].get_edge_center(
                [LEFT, UP, RIGHT, DOWN][(i + 1) % 4]  # Reverse for destination
            )
            # Simplified: use curved arrows
            arrow = CurvedArrow(
                phase_objs[i][0].get_right() if i == 0 else
                phase_objs[i][0].get_bottom() if i == 1 else
                phase_objs[i][0].get_left() if i == 2 else
                phase_objs[i][0].get_top(),
                phase_objs[(i + 1) % 4][0].get_top() if i == 0 else
                phase_objs[(i + 1) % 4][0].get_left() if i == 1 else
                phase_objs[(i + 1) % 4][0].get_bottom() if i == 2 else
                phase_objs[(i + 1) % 4][0].get_right(),
                angle=-0.5,
                color=GREY,
            )
            arrows.append(arrow)

        for arrow in arrows:
            self.play(Create(arrow), run_time=0.4)
        self.wait(1)

        # Highlight each phase with detail
        details = [
            "Before any incident: build the team, write the playbooks,\ntrain, run tabletop exercises, establish communications.",
            "Recognize something is wrong. Triage: how severe?\nHow many systems? What type? Who needs to know?",
            "Short-term: isolate host. Long-term: segment network.\nEradicate: remove malware, rotate creds, rebuild.\nRecover: restore and monitor for re-infection.",
            "The most important phase. What happened? Why?\nWhat changes prevent recurrence? Update everything.\nFeed back into Preparation. The loop closes.",
        ]

        for i, detail in enumerate(details):
            box, name, desc = phase_objs[i]
            highlight = SurroundingRectangle(box, color=WHITE, buff=0.1, stroke_width=3)
            detail_text = Text(detail, font_size=14, color=WHITE).to_edge(DOWN, buff=0.3)

            self.play(Create(highlight), FadeIn(detail_text), run_time=0.5)
            self.wait(2.5)
            self.play(FadeOut(highlight), FadeOut(detail_text), run_time=0.3)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("IR Lifecycle Summary", font_size=28, color=BLUE, weight=BOLD),
            Text("Prepare → Detect & Analyze →", font_size=22),
            Text("Contain, Eradicate, Recover → Lessons Learned", font_size=22),
            Text("", font_size=8),
            Text("It is a LOOP — lessons feed back into preparation.", font_size=22, color=YELLOW),
            Text("Personnel safety is ALWAYS first in physical events.", font_size=22, color=RED),
            Text("Preserve evidence BEFORE containment actions.", font_size=22, color=GREEN),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
