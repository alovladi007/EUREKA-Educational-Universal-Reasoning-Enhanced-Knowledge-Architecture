"""
D7-02 — 3-2-1-1-0 Backup Strategy
Run: manim -pql backup_321.py Backup321
"""
from manim import *


class Backup321(Scene):
    def construct(self):
        title = Text("3-2-1-1-0 Backup Strategy", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        rules = [
            ("3", "copies of your data", GREEN, "Original + at least 2 backups.\nMinimum redundancy."),
            ("2", "different media types", YELLOW, "Disk + tape, or disk + cloud.\nSingle media failure can't destroy both."),
            ("1", "copy offsite", ORANGE, "Fire, flood, theft, or ransomware\ncan't destroy all copies."),
            ("1", "immutable or air-gapped", RED, "Ransomware specifically targets backups.\nImmutable copies can't be encrypted."),
            ("0", "errors verified", PURPLE, "Test restores regularly.\nUntested backups often fail."),
        ]

        for i, (num, rule, color, detail) in enumerate(rules):
            # Clear previous detail
            if i > 0:
                self.play(FadeOut(detail_text))

            # Number
            number = Text(num, font_size=80, color=color, weight=BOLD).move_to(LEFT * 3)
            rule_text = Text(rule, font_size=28, color=WHITE).next_to(number, RIGHT, buff=0.3)
            detail_text = Text(detail, font_size=20, color=GREY).move_to(DOWN * 1.5)

            if i == 0:
                self.play(Write(number), Write(rule_text), FadeIn(detail_text), run_time=0.8)
            else:
                self.play(
                    Transform(prev_num, number),
                    Transform(prev_rule, rule_text),
                    FadeIn(detail_text),
                    run_time=0.8
                )

            if i == 0:
                prev_num = number
                prev_rule = rule_text

            self.wait(2)

        self.play(FadeOut(detail_text))

        # Why 3-2-1-1-0 and not just 3-2-1
        self.play(*[FadeOut(m) for m in self.mobjects])

        why_title = Text("Why the extra 1-0?", font_size=30, color=RED, weight=BOLD).to_edge(UP)
        self.play(Write(why_title))

        ransomware_text = VGroup(
            Text("Modern ransomware specifically targets backups", font_size=22, color=RED),
            Text("before triggering the encryption payload.", font_size=22, color=RED),
            Text("", font_size=8),
            Text("Maersk / NotPetya 2017: all Windows servers destroyed", font_size=18),
            Text("Colonial Pipeline 2021: backup recovery was critical", font_size=18),
            Text("Change Healthcare 2024: backup readiness tested", font_size=18),
            Text("", font_size=8),
            Text("The extra '1' (immutable/air-gapped) protects against", font_size=20, color=YELLOW),
            Text("an attacker who has admin access to your network.", font_size=20, color=YELLOW),
            Text("", font_size=8),
            Text("The '0' (verified) protects against the worst surprise:", font_size=20, color=PURPLE),
            Text("discovering your backups don't work during a real incident.", font_size=20, color=PURPLE),
        ).arrange(DOWN, buff=0.08).move_to(ORIGIN + DOWN * 0.3)

        for line in ransomware_text:
            self.play(FadeIn(line), run_time=0.3)
        self.wait(3)
