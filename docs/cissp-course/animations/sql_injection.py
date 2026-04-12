"""
D8-02 — SQL Injection defeated by Parameterized Queries
Run: manim -pql sql_injection.py SQLInjection
"""
from manim import *


class SQLInjection(Scene):
    def construct(self):
        title = Text("SQL Injection & Parameterized Queries", font_size=32, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Vulnerable code
        vuln_label = Text("VULNERABLE CODE:", font_size=20, color=RED, weight=BOLD).move_to(UP * 2 + LEFT * 2)
        vuln_code = Text(
            'query = "SELECT * FROM users\n'
            '         WHERE name = \'" + username + "\'";',
            font_size=16, color=YELLOW,
        ).next_to(vuln_label, DOWN, aligned_edge=LEFT, buff=0.2)

        self.play(Write(vuln_label), FadeIn(vuln_code))
        self.wait(1)

        # Attack 1
        attack1_input = Text("User enters: admin' OR '1'='1", font_size=18, color=RED).next_to(vuln_code, DOWN, buff=0.4)
        attack1_result = VGroup(
            Text("Resulting query:", font_size=14, color=GREY),
            Text("SELECT * FROM users WHERE name = 'admin' OR '1'='1'",
                 font_size=14, color=RED),
            Text("→ Returns ALL users (OR is always true)", font_size=16, color=RED, weight=BOLD),
        ).arrange(DOWN, buff=0.05).next_to(attack1_input, DOWN, buff=0.2)

        self.play(Write(attack1_input))
        self.play(FadeIn(attack1_result))
        self.wait(1.5)

        # Attack 2
        self.play(FadeOut(attack1_input), FadeOut(attack1_result))
        attack2_input = Text("User enters: admin'; DROP TABLE users; --", font_size=18, color=RED).next_to(vuln_code, DOWN, buff=0.4)
        attack2_result = VGroup(
            Text("→ DROP TABLE users", font_size=20, color=RED, weight=BOLD),
            Text("Every user is DELETED.", font_size=18, color=RED),
        ).arrange(DOWN, buff=0.1).next_to(attack2_input, DOWN, buff=0.2)

        self.play(Write(attack2_input))
        self.play(FadeIn(attack2_result))
        self.wait(1.5)

        # Transition to fix
        self.play(*[FadeOut(m) for m in self.mobjects])

        fix_title = Text("THE FIX: Parameterized Queries", font_size=30, color=GREEN, weight=BOLD).to_edge(UP)
        self.play(Write(fix_title))

        fix_code = Text(
            'query = "SELECT * FROM users\n'
            '         WHERE name = ?";\n'
            'cursor.execute(query, [username]);',
            font_size=16, color=GREEN,
        ).move_to(UP * 0.5)
        self.play(FadeIn(fix_code))
        self.wait(0.5)

        explanation = VGroup(
            Text("The ? is a placeholder. Value bound separately.", font_size=20, color=GREEN),
            Text("Database knows the value is DATA, not SQL.", font_size=20, color=GREEN),
        ).arrange(DOWN, buff=0.1).next_to(fix_code, DOWN, buff=0.3)
        self.play(FadeIn(explanation))
        self.wait(1)

        # Same attack, now harmless
        same_attack = VGroup(
            Text("Same input: admin' OR '1'='1", font_size=18, color=YELLOW),
            Text("Database looks for a user literally named:", font_size=16),
            Text("\"admin' OR '1'='1\"", font_size=18, color=GREEN),
            Text("Not found. No match. Attack FAILS.", font_size=20, color=GREEN, weight=BOLD),
        ).arrange(DOWN, buff=0.1).next_to(explanation, DOWN, buff=0.3)
        self.play(FadeIn(same_attack))
        self.wait(2)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("Parameterized queries don't filter characters.", font_size=24),
            Text("They SEPARATE code from data.", font_size=24, color=GREEN, weight=BOLD),
            Text("Injection is structurally impossible.", font_size=24, color=GREEN, weight=BOLD),
            Text("", font_size=8),
            Text("Never concatenate user input into SQL.", font_size=22, color=RED),
            Text("Use parameterized queries or ORMs that use them.", font_size=22, color=YELLOW),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
