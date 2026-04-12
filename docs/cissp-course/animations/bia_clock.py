"""
D1-07 — BIA Clock: MTD, RTO, RPO, WRT on a timeline
Run: manim -pql bia_clock.py BIAClock
"""
from manim import *


class BIAClock(Scene):
    def construct(self):
        title = Text("BIA Clock: Recovery Metrics", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Timeline
        timeline = Arrow(LEFT * 6, RIGHT * 6, buff=0, color=WHITE, stroke_width=2)
        timeline.shift(DOWN * 0.5)
        self.play(Create(timeline))

        # Disaster point at center
        disaster_line = DashedLine(ORIGIN + DOWN * 0.5 + UP * 1.5, ORIGIN + DOWN * 0.5 + DOWN * 1,
                                    color=RED, stroke_width=3)
        disaster_label = Text("DISASTER", font_size=20, color=RED, weight=BOLD).next_to(disaster_line, UP, buff=0.1)
        t0 = Text("t=0", font_size=14, color=RED).next_to(disaster_line, DOWN, buff=0.1)
        self.play(Create(disaster_line), Write(disaster_label), Write(t0))
        self.wait(0.5)

        # RPO — looks backward
        rpo_start = LEFT * 3 + DOWN * 0.5
        rpo_end = ORIGIN + DOWN * 0.5
        rpo_arrow = DoubleArrow(rpo_start, rpo_end, buff=0, color=PURPLE, stroke_width=3).shift(DOWN * 0.5)
        rpo_label = Text("RPO", font_size=20, color=PURPLE, weight=BOLD).next_to(rpo_arrow, DOWN, buff=0.1)
        rpo_desc = Text("Last good backup", font_size=14, color=PURPLE).next_to(rpo_label, DOWN, buff=0.05)
        backup_dot = Dot(rpo_start, color=PURPLE, radius=0.1)
        backup_label = Text("Last\nbackup", font_size=12, color=PURPLE).next_to(backup_dot, UP, buff=0.1)

        self.play(FadeIn(backup_dot), Write(backup_label))
        self.play(Create(rpo_arrow), Write(rpo_label), Write(rpo_desc))
        self.wait(1)

        # RTO — looks forward
        rto_start = ORIGIN + DOWN * 0.5
        rto_end = RIGHT * 2.5 + DOWN * 0.5
        rto_arrow = DoubleArrow(rto_start, rto_end, buff=0, color=GREEN, stroke_width=3).shift(UP * 0.5)
        rto_label = Text("RTO", font_size=20, color=GREEN, weight=BOLD).next_to(rto_arrow, UP, buff=0.1)
        rto_desc = Text("Service restored", font_size=14, color=GREEN).next_to(rto_label, UP, buff=0.05)
        restore_dot = Dot(rto_end, color=GREEN, radius=0.1)

        self.play(FadeIn(restore_dot))
        self.play(Create(rto_arrow), Write(rto_label), Write(rto_desc))
        self.wait(1)

        # WRT — after RTO
        wrt_start = RIGHT * 2.5 + DOWN * 0.5
        wrt_end = RIGHT * 4.5 + DOWN * 0.5
        wrt_arrow = DoubleArrow(wrt_start, wrt_end, buff=0, color=ORANGE, stroke_width=3).shift(UP * 0.5)
        wrt_label = Text("WRT", font_size=20, color=ORANGE, weight=BOLD).next_to(wrt_arrow, UP, buff=0.1)
        wrt_desc = Text("Verify & resume", font_size=14, color=ORANGE).next_to(wrt_label, UP, buff=0.05)
        ops_dot = Dot(wrt_end, color=ORANGE, radius=0.1)

        self.play(FadeIn(ops_dot))
        self.play(Create(wrt_arrow), Write(wrt_label), Write(wrt_desc))
        self.wait(1)

        # MTD bracket
        mtd_brace = Brace(
            Line(ORIGIN + DOWN * 0.5, RIGHT * 4.5 + DOWN * 0.5),
            DOWN, buff=0.2, color=RED
        ).shift(DOWN * 1)
        mtd_label = Text("MTD ≥ RTO + WRT", font_size=22, color=RED, weight=BOLD).next_to(mtd_brace, DOWN, buff=0.1)

        self.play(Create(mtd_brace), Write(mtd_label))
        self.wait(1.5)

        # Worked example
        self.play(*[FadeOut(m) for m in self.mobjects])

        example_title = Text("Worked Examples", font_size=30, color=BLUE).to_edge(UP)
        self.play(Write(example_title))

        # Example 1: feasible
        ex1 = VGroup(
            Text("Example 1:", font_size=20, color=GREEN, weight=BOLD),
            Text("RTO = 4h, WRT = 2h, MTD = 8h", font_size=20),
            Text("4 + 2 = 6 ≤ 8 ✓ FEASIBLE", font_size=22, color=GREEN),
        ).arrange(DOWN, buff=0.15).move_to(UP * 0.5)
        self.play(FadeIn(ex1))
        self.wait(1)

        # Example 2: infeasible
        ex2 = VGroup(
            Text("Example 2:", font_size=20, color=RED, weight=BOLD),
            Text("RTO = 6h, WRT = 4h, MTD = 8h", font_size=20),
            Text("6 + 4 = 10 > 8 ✗ INFEASIBLE", font_size=22, color=RED),
        ).arrange(DOWN, buff=0.15).move_to(DOWN * 1.5)
        self.play(FadeIn(ex2))
        self.wait(1.5)

        # Memory hook
        self.play(FadeOut(ex1), FadeOut(ex2))
        memory = VGroup(
            Text("Remember:", font_size=26, color=YELLOW, weight=BOLD),
            Text("RPO looks BACKWARD (to last backup)", font_size=22, color=PURPLE),
            Text("RTO looks FORWARD (to service restored)", font_size=22, color=GREEN),
            Text("WRT is the gap AFTER (verify & resume)", font_size=22, color=ORANGE),
            Text("MTD ≥ RTO + WRT (always)", font_size=22, color=RED),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN)
        self.play(FadeIn(memory))
        self.wait(3)
