"""
D5-09 — Access Control Models: DAC / MAC / RBAC / ABAC
Run: manim -pql access_control_models.py AccessControlModels
"""
from manim import *


class AccessControlModels(Scene):
    def construct(self):
        title = Text("Access Control Models", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        models = [
            {
                "name": "DAC",
                "full": "Discretionary Access Control",
                "color": GREEN,
                "desc": "Owner decides who can access",
                "example": "File permissions (chmod), Windows ACLs",
                "pro": "Flexible",
                "con": "Error-prone, no central enforcement",
            },
            {
                "name": "MAC",
                "full": "Mandatory Access Control",
                "color": RED,
                "desc": "System enforces labels — no owner override",
                "example": "Military classified, SELinux",
                "pro": "Strong, policy-driven",
                "con": "Inflexible, complex to manage",
            },
            {
                "name": "RBAC",
                "full": "Role-Based Access Control",
                "color": YELLOW,
                "desc": "Access granted to roles, users assigned to roles",
                "example": "Enterprise apps with hundreds of users",
                "pro": "Scales well, auditable",
                "con": "Role explosion in complex orgs",
            },
            {
                "name": "ABAC",
                "full": "Attribute-Based Access Control",
                "color": PURPLE,
                "desc": "Decisions use subject, resource, action, environment attributes",
                "example": "Cloud IAM, dynamic policies",
                "pro": "Most flexible, per-request",
                "con": "Hardest to audit",
            },
        ]

        for i, model in enumerate(models):
            # Clear previous
            if i > 0:
                self.play(*[FadeOut(m) for m in self.mobjects if m != title])

            # Model card
            name_text = Text(model["name"], font_size=40, color=model["color"], weight=BOLD).move_to(UP * 1.5)
            full_text = Text(model["full"], font_size=22, color=model["color"]).next_to(name_text, DOWN, buff=0.1)
            desc_text = Text(model["desc"], font_size=20).next_to(full_text, DOWN, buff=0.4)
            example_text = Text(f"Example: {model['example']}", font_size=18, color=GREY).next_to(desc_text, DOWN, buff=0.2)

            pro_text = Text(f"✓ {model['pro']}", font_size=18, color=GREEN).move_to(DOWN * 1 + LEFT * 2)
            con_text = Text(f"✗ {model['con']}", font_size=18, color=RED).move_to(DOWN * 1 + RIGHT * 2)

            self.play(Write(name_text), Write(full_text), run_time=0.5)
            self.play(Write(desc_text), Write(example_text), run_time=0.5)
            self.play(FadeIn(pro_text), FadeIn(con_text), run_time=0.5)
            self.wait(2)

        # Summary comparison
        self.play(*[FadeOut(m) for m in self.mobjects if m != title])

        summary = VGroup(
            Text("When to use which:", font_size=24, color=BLUE, weight=BOLD),
            Text("• Government classified data → MAC", font_size=20),
            Text("• Enterprise with many apps → RBAC", font_size=20),
            Text("• Cloud, dynamic, per-request → ABAC", font_size=20),
            Text("• Simple file sharing → DAC", font_size=20),
            Text("", font_size=8),
            Text("Owner DAC, System MAC, Role RBAC, Attribute ABAC",
                 font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
