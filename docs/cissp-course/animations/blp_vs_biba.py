"""
D3-02 — Bell-LaPadula vs Biba: Confidentiality vs Integrity models
Run: manim -pql blp_vs_biba.py BLPvsBiba
"""
from manim import *


class BLPvsBiba(Scene):
    def construct(self):
        title = Text("Bell-LaPadula vs Biba", font_size=40, color=BLUE).to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # BLP side
        blp_title = Text("Bell-LaPadula", font_size=28, color=GREEN, weight=BOLD).move_to(LEFT * 3.2 + UP * 2)
        blp_subtitle = Text("Confidentiality", font_size=20, color=GREEN).next_to(blp_title, DOWN, buff=0.1)

        blp_levels = VGroup()
        blp_labels = ["Top Secret", "Secret", "Confidential", "Unclassified"]
        blp_colors = [RED, ORANGE, YELLOW, GREEN_B]
        for i, (label, color) in enumerate(zip(blp_labels, blp_colors)):
            box = VGroup(
                RoundedRectangle(width=2.8, height=0.5, color=color, fill_opacity=0.3),
                Text(label, font_size=14, color=WHITE),
            )
            box[1].move_to(box[0])
            blp_levels.add(box)
        blp_levels.arrange(DOWN, buff=0.15).move_to(LEFT * 3.2 + DOWN * 0.5)

        self.play(Write(blp_title), Write(blp_subtitle), FadeIn(blp_levels))
        self.wait(0.5)

        # BLP rules
        # No read up
        read_up_x = Arrow(
            blp_levels[2].get_right() + RIGHT * 0.1,
            blp_levels[0].get_right() + RIGHT * 0.1,
            buff=0.05, color=RED, stroke_width=3
        )
        read_up_label = Text("No Read Up", font_size=14, color=RED).next_to(read_up_x, RIGHT, buff=0.1)
        self.play(Create(read_up_x), Write(read_up_label))
        self.wait(0.5)

        # No write down
        write_down_x = Arrow(
            blp_levels[0].get_left() + LEFT * 0.1,
            blp_levels[2].get_left() + LEFT * 0.1,
            buff=0.05, color=ORANGE, stroke_width=3
        )
        write_down_label = Text("No Write Down", font_size=14, color=ORANGE).next_to(write_down_x, LEFT, buff=0.1)
        self.play(Create(write_down_x), Write(write_down_label))
        self.wait(1)

        # Biba side
        biba_title = Text("Biba", font_size=28, color=PURPLE, weight=BOLD).move_to(RIGHT * 3.2 + UP * 2)
        biba_subtitle = Text("Integrity", font_size=20, color=PURPLE).next_to(biba_title, DOWN, buff=0.1)

        biba_levels = VGroup()
        biba_labels = ["High Integrity", "Medium Integrity", "Low Integrity"]
        biba_colors = [BLUE, TEAL, GREY]
        for i, (label, color) in enumerate(zip(biba_labels, biba_colors)):
            box = VGroup(
                RoundedRectangle(width=2.8, height=0.5, color=color, fill_opacity=0.3),
                Text(label, font_size=14, color=WHITE),
            )
            box[1].move_to(box[0])
            biba_levels.add(box)
        biba_levels.arrange(DOWN, buff=0.15).move_to(RIGHT * 3.2 + DOWN * 0.3)

        self.play(Write(biba_title), Write(biba_subtitle), FadeIn(biba_levels))
        self.wait(0.5)

        # Biba rules — reversed
        read_down_x = Arrow(
            biba_levels[0].get_right() + RIGHT * 0.1,
            biba_levels[2].get_right() + RIGHT * 0.1,
            buff=0.05, color=RED, stroke_width=3
        )
        read_down_label = Text("No Read Down", font_size=14, color=RED).next_to(read_down_x, RIGHT, buff=0.1)
        self.play(Create(read_down_x), Write(read_down_label))
        self.wait(0.5)

        write_up_x = Arrow(
            biba_levels[2].get_left() + LEFT * 0.1,
            biba_levels[0].get_left() + LEFT * 0.1,
            buff=0.05, color=ORANGE, stroke_width=3
        )
        write_up_label = Text("No Write Up", font_size=14, color=ORANGE).next_to(write_up_x, LEFT, buff=0.1)
        self.play(Create(write_up_x), Write(write_up_label))
        self.wait(1)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("BLP (Confidentiality):", font_size=24, color=GREEN, weight=BOLD),
            Text("No Read Up, No Write Down", font_size=22, color=GREEN),
            Text("", font_size=10),
            Text("Biba (Integrity):", font_size=24, color=PURPLE, weight=BOLD),
            Text("No Read Down, No Write Up", font_size=22, color=PURPLE),
            Text("", font_size=10),
            Text("They are DUALS — reversed directions,", font_size=20, color=YELLOW),
            Text("protecting different properties.", font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
