"""
D1-03 — CIA Triad expanding to Parkerian Hexad
Run: manim -pql cia_triad.py CIATriad
"""
from manim import *
import numpy as np


class CIATriad(Scene):
    def construct(self):
        title = Text("CIA Triad → Parkerian Hexad", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Draw CIA triangle
        triangle = RegularPolygon(n=3, radius=2, color=BLUE, fill_opacity=0.1)
        triangle.move_to(ORIGIN)

        c_label = Text("Confidentiality", font_size=20, color=BLUE).next_to(triangle.get_vertices()[0], UP, buff=0.2)
        i_label = Text("Integrity", font_size=20, color=GREEN).next_to(triangle.get_vertices()[1], DOWN + LEFT, buff=0.2)
        a_label = Text("Availability", font_size=20, color=ORANGE).next_to(triangle.get_vertices()[2], DOWN + RIGHT, buff=0.2)

        self.play(Create(triangle), Write(c_label), Write(i_label), Write(a_label))
        self.wait(1)

        # Scenario: stolen encrypted laptop
        scenario = VGroup(
            Text("Scenario: Encrypted laptop stolen", font_size=20, color=YELLOW),
            Text("Key not compromised", font_size=18),
        ).arrange(DOWN, buff=0.1).to_edge(DOWN, buff=1)
        self.play(FadeIn(scenario))
        self.wait(1)

        # CIA analysis
        c_check = Text("Confidentiality: Intact ✓", font_size=16, color=GREEN).move_to(RIGHT * 3.5 + UP * 1)
        i_check = Text("Integrity: Intact ✓", font_size=16, color=GREEN).next_to(c_check, DOWN, aligned_edge=LEFT)
        a_check = Text("Availability: Intact (backups) ✓", font_size=16, color=GREEN).next_to(i_check, DOWN, aligned_edge=LEFT)
        question = Text("But we LOST something...", font_size=18, color=RED).next_to(a_check, DOWN, buff=0.3)

        self.play(FadeIn(c_check))
        self.play(FadeIn(i_check))
        self.play(FadeIn(a_check))
        self.play(Write(question))
        self.wait(1)

        # Morph to hexagon
        self.play(FadeOut(scenario), FadeOut(c_check), FadeOut(i_check), FadeOut(a_check), FadeOut(question))

        hexagon = RegularPolygon(n=6, radius=2.2, color=PURPLE, fill_opacity=0.1)
        hexagon.move_to(ORIGIN)

        self.play(Transform(triangle, hexagon), run_time=1.5)

        # Label all 6 vertices
        hex_labels = ["Confidentiality", "Integrity", "Availability",
                       "Authenticity", "Utility", "Possession"]
        hex_colors = [BLUE, GREEN, ORANGE, TEAL, YELLOW, RED]
        vertices = hexagon.get_vertices()

        label_objs = []
        for i, (label, color) in enumerate(zip(hex_labels, hex_colors)):
            direction = vertices[i] - hexagon.get_center()
            direction = direction / np.linalg.norm(direction) * 0.5
            t = Text(label, font_size=16, color=color).next_to(vertices[i], direction, buff=0.15)
            label_objs.append(t)

        self.play(FadeOut(c_label), FadeOut(i_label), FadeOut(a_label))
        for t in label_objs:
            self.play(FadeIn(t), run_time=0.3)
        self.wait(1)

        # Highlight Possession
        possession_box = SurroundingRectangle(label_objs[5], color=RED, buff=0.1)
        answer = Text("POSSESSION — the laptop is no longer under our control",
                       font_size=18, color=RED).to_edge(DOWN, buff=0.5)
        self.play(Create(possession_box), Write(answer))
        self.wait(2)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("CIA Triad: Confidentiality, Integrity, Availability", font_size=22, color=BLUE),
            Text("Parkerian Hexad adds:", font_size=22),
            Text("  Authenticity — data from claimed source", font_size=20, color=TEAL),
            Text("  Utility — data is usable for its purpose", font_size=20, color=YELLOW),
            Text("  Possession — data under owner's control", font_size=20, color=RED),
            Text("", font_size=8),
            Text("When the triad can't describe the loss,", font_size=20, color=GREY),
            Text("reach for the hexad.", font_size=20, color=GREY),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
