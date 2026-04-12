"""
D3-12 — Zero Trust Architecture (NIST SP 800-207)
Run: manim -pql zero_trust.py ZeroTrust
"""
from manim import *


class ZeroTrust(Scene):
    def construct(self):
        title = Text("Zero Trust Architecture", font_size=36, color=BLUE).to_edge(UP)
        subtitle = Text("NIST SP 800-207", font_size=20, color=GREY).next_to(title, DOWN, buff=0.1)
        self.play(Write(title), Write(subtitle))

        # Old model: castle and moat
        old_label = Text("Old Model: Castle & Moat", font_size=24, color=RED, weight=BOLD).move_to(UP * 1.5)
        self.play(Write(old_label))

        # Castle wall
        wall = Rectangle(width=8, height=3, color=GREY, fill_opacity=0.1).move_to(DOWN * 0.5)
        wall_label = Text("TRUSTED\nINTERNAL NETWORK", font_size=16, color=GREEN).move_to(wall)
        outside = Text("UNTRUSTED", font_size=14, color=RED).move_to(DOWN * 2.8)

        # Internal devices
        devices = VGroup()
        for i in range(5):
            d = Dot(color=GREEN, radius=0.1).move_to(
                LEFT * (2 - i) + DOWN * (0.2 + (i % 2) * 0.4)
            )
            devices.add(d)

        self.play(Create(wall), Write(wall_label), Write(outside), FadeIn(devices))
        self.wait(1)

        # Problem: attacker gets inside
        attacker = Dot(color=RED, radius=0.15).move_to(LEFT * 1 + DOWN * 0.8)
        attacker_label = Text("Attacker\ninside!", font_size=12, color=RED).next_to(attacker, DOWN, buff=0.05)
        self.play(FadeIn(attacker), Write(attacker_label))

        # Attacker reaches everything
        for d in devices:
            line = Line(attacker.get_center(), d.get_center(), color=RED, stroke_width=1, stroke_opacity=0.5)
            self.play(Create(line), run_time=0.15)

        problem = Text("Flat network → attacker reaches everything", font_size=18, color=RED).to_edge(DOWN, buff=0.3)
        self.play(Write(problem))
        self.wait(1.5)

        # Transition to zero trust
        self.play(*[FadeOut(m) for m in self.mobjects])

        zt_label = Text("Zero Trust: Never Trust, Always Verify", font_size=28, color=GREEN, weight=BOLD).to_edge(UP)
        self.play(Write(zt_label))

        # Architecture: PE → PA → PEP → Resource
        components = VGroup()

        user = VGroup(
            Circle(radius=0.4, color=BLUE, fill_opacity=0.2),
            Text("User", font_size=14, color=BLUE),
        ).arrange(DOWN, buff=0.05).move_to(LEFT * 5)

        pep = VGroup(
            RoundedRectangle(width=1.8, height=1, color=ORANGE, fill_opacity=0.2),
            Text("PEP", font_size=16, color=ORANGE, weight=BOLD),
            Text("Policy\nEnforcement", font_size=10, color=GREY),
        )
        pep[1].move_to(pep[0].get_center() + UP * 0.15)
        pep[2].move_to(pep[0].get_center() + DOWN * 0.2)
        pep.move_to(LEFT * 1.5)

        pe = VGroup(
            RoundedRectangle(width=1.8, height=1, color=GREEN, fill_opacity=0.2),
            Text("PE", font_size=16, color=GREEN, weight=BOLD),
            Text("Policy\nEngine", font_size=10, color=GREY),
        )
        pe[1].move_to(pe[0].get_center() + UP * 0.15)
        pe[2].move_to(pe[0].get_center() + DOWN * 0.2)
        pe.move_to(UP * 2 + RIGHT * 1)

        pa = VGroup(
            RoundedRectangle(width=1.8, height=1, color=YELLOW, fill_opacity=0.2),
            Text("PA", font_size=16, color=YELLOW, weight=BOLD),
            Text("Policy\nAdmin", font_size=10, color=GREY),
        )
        pa[1].move_to(pa[0].get_center() + UP * 0.15)
        pa[2].move_to(pa[0].get_center() + DOWN * 0.2)
        pa.move_to(UP * 2 + LEFT * 1.5)

        resource = VGroup(
            RoundedRectangle(width=1.8, height=1, color=RED, fill_opacity=0.2),
            Text("Resource", font_size=16, color=RED, weight=BOLD),
        )
        resource[1].move_to(resource[0])
        resource.move_to(RIGHT * 4)

        self.play(FadeIn(user), FadeIn(pep), FadeIn(pe), FadeIn(pa), FadeIn(resource))

        # Arrows showing flow
        a1 = Arrow(user[0].get_right(), pep[0].get_left(), buff=0.1, color=BLUE, stroke_width=2)
        a1_label = Text("Request", font_size=11, color=BLUE).next_to(a1, UP, buff=0.03)
        self.play(Create(a1), Write(a1_label), run_time=0.5)

        a2 = Arrow(pep[0].get_top(), pa[0].get_bottom(), buff=0.1, color=ORANGE, stroke_width=2)
        a2_label = Text("Check\npolicy", font_size=10, color=ORANGE).next_to(a2, LEFT, buff=0.03)
        self.play(Create(a2), Write(a2_label), run_time=0.5)

        a3 = Arrow(pa[0].get_right(), pe[0].get_left(), buff=0.1, color=YELLOW, stroke_width=2)
        a3_label = Text("Evaluate", font_size=10, color=YELLOW).next_to(a3, UP, buff=0.03)
        self.play(Create(a3), Write(a3_label), run_time=0.5)

        a4 = Arrow(pep[0].get_right(), resource[0].get_left(), buff=0.1, color=GREEN, stroke_width=2)
        a4_label = Text("Allow/Deny", font_size=11, color=GREEN).next_to(a4, DOWN, buff=0.03)
        self.play(Create(a4), Write(a4_label), run_time=0.5)

        # Per-request evaluation
        per_req = VGroup(
            Text("For EACH request:", font_size=18, color=YELLOW),
            Text("Who? What device? What state? What context?", font_size=16),
            Text("→ Policy decision → Grant or deny", font_size=16, color=GREEN),
        ).arrange(DOWN, buff=0.08).to_edge(DOWN, buff=0.3)
        self.play(FadeIn(per_req))
        self.wait(2)

        # Key points
        self.play(*[FadeOut(m) for m in self.mobjects])
        points = VGroup(
            Text("Zero Trust Key Points", font_size=28, color=BLUE, weight=BOLD),
            Text("• Trust is never implicit based on network location", font_size=20),
            Text("• Every request is authenticated and authorized", font_size=20),
            Text("• Continuous evaluation, not one-time check", font_size=20),
            Text("• It is an ARCHITECTURE, not a product", font_size=20, color=YELLOW),
            Text("• Multi-year transformation, not a tool purchase", font_size=20),
            Text("• NIST SP 800-207 is the standard", font_size=20, color=GREEN),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(points))
        self.wait(3)
