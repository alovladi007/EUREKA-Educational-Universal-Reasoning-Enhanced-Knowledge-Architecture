"""
D5-04 — Kerberos Authentication Flow
Manim Community Edition script. Run: manim -pql kerberos_flow.py KerberosFlow

Storyboard: docs/cissp-course/domain-5/03-storyboards.md §D5-04
"""
from manim import *


class KerberosFlow(Scene):
    def construct(self):
        title = Text("Kerberos Authentication Flow", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Actors
        client = VGroup(
            Circle(radius=0.4, color=GREEN, fill_opacity=0.3),
            Text("Client", font_size=18),
        ).arrange(DOWN, buff=0.1).move_to(LEFT * 5)

        kdc = VGroup(
            RoundedRectangle(width=2.5, height=1.2, corner_radius=0.1,
                             color=YELLOW, fill_opacity=0.2),
            Text("KDC", font_size=20, color=YELLOW),
            Text("(AS + TGS)", font_size=14, color=GREY),
        )
        kdc[1].move_to(kdc[0].get_center() + UP * 0.15)
        kdc[2].move_to(kdc[0].get_center() + DOWN * 0.2)
        kdc.move_to(ORIGIN + UP * 0.5)

        service = VGroup(
            Circle(radius=0.4, color=RED, fill_opacity=0.3),
            Text("Service", font_size=18),
        ).arrange(DOWN, buff=0.1).move_to(RIGHT * 5)

        self.play(FadeIn(client), FadeIn(kdc), FadeIn(service))
        self.wait(0.5)

        # Step 1: AS-REQ
        step1 = Text("1. AS-REQ", font_size=16, color=GREEN).next_to(title, DOWN, buff=0.3).to_edge(LEFT)
        arrow1 = Arrow(client[0].get_right(), kdc[0].get_left(), buff=0.2, color=GREEN)
        label1 = Text("Username + encrypted timestamp", font_size=12, color=GREEN).next_to(arrow1, UP, buff=0.1)
        self.play(Write(step1), Create(arrow1), Write(label1), run_time=1)
        self.wait(1)

        # Step 2: AS-REP (TGT)
        step2 = Text("2. AS-REP: TGT + session key", font_size=16, color=YELLOW).next_to(step1, DOWN, aligned_edge=LEFT)
        arrow2 = Arrow(kdc[0].get_left(), client[0].get_right(), buff=0.2, color=YELLOW).shift(DOWN * 0.3)
        tgt_label = Text("TGT (encrypted with KDC key)", font_size=12, color=YELLOW).next_to(arrow2, DOWN, buff=0.1)
        self.play(Write(step2), Create(arrow2), Write(tgt_label), run_time=1)
        self.wait(1)

        self.play(FadeOut(arrow1), FadeOut(label1), FadeOut(arrow2), FadeOut(tgt_label))

        # Step 3: TGS-REQ
        step3 = Text("3. TGS-REQ: TGT + service name", font_size=16, color=GREEN).next_to(step2, DOWN, aligned_edge=LEFT)
        arrow3 = Arrow(client[0].get_right(), kdc[0].get_left(), buff=0.2, color=GREEN)
        label3 = Text("TGT + 'I want Service X'", font_size=12, color=GREEN).next_to(arrow3, UP, buff=0.1)
        self.play(Write(step3), Create(arrow3), Write(label3), run_time=1)
        self.wait(1)

        # Step 4: TGS-REP (Service Ticket)
        step4 = Text("4. TGS-REP: Service ticket", font_size=16, color=YELLOW).next_to(step3, DOWN, aligned_edge=LEFT)
        arrow4 = Arrow(kdc[0].get_left(), client[0].get_right(), buff=0.2, color=YELLOW).shift(DOWN * 0.3)
        st_label = Text("Service ticket (encrypted with service key)", font_size=12, color=YELLOW).next_to(arrow4, DOWN, buff=0.1)
        self.play(Write(step4), Create(arrow4), Write(st_label), run_time=1)
        self.wait(1)

        self.play(FadeOut(arrow3), FadeOut(label3), FadeOut(arrow4), FadeOut(st_label))

        # Step 5: Service access
        step5 = Text("5. Present service ticket → Access granted", font_size=16, color=RED).next_to(step4, DOWN, aligned_edge=LEFT)
        arrow5 = Arrow(client[0].get_right(), service[0].get_left(), buff=0.2, color=RED)
        acc_label = Text("Service ticket", font_size=12, color=RED).next_to(arrow5, UP, buff=0.1)
        self.play(Write(step5), Create(arrow5), Write(acc_label), run_time=1)
        self.wait(1)

        # Summary
        self.play(*[FadeOut(mob) for mob in [arrow5, acc_label, step1, step2, step3, step4, step5]])

        summary = VGroup(
            Text("No passwords cross the wire", font_size=22, color=GREEN),
            Text("Tickets are time-bound", font_size=22, color=YELLOW),
            Text("Mutual authentication possible", font_size=22, color=RED),
            Text("KDC = AS + TGS", font_size=22, color=BLUE),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN + DOWN * 1.5)
        self.play(FadeIn(summary))
        self.wait(3)
