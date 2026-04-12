"""
D2-04 — Three Data States: At Rest, In Transit, In Use
Run: manim -pql data_states.py DataStates
"""
from manim import *


class DataStates(Scene):
    def construct(self):
        title = Text("Three Data States", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Three panels
        states = [
            {
                "name": "At Rest",
                "icon_text": "DISK",
                "color": BLUE,
                "controls": ["AES-256 encryption", "Access control", "Physical security"],
                "desc": "Data stored on media",
            },
            {
                "name": "In Transit",
                "icon_text": "WIRE",
                "color": GREEN,
                "controls": ["TLS 1.3", "IPsec", "SSH / VPN"],
                "desc": "Data crossing a network",
            },
            {
                "name": "In Use",
                "icon_text": "CPU",
                "color": RED,
                "controls": ["Confidential Computing", "Enclaves (SGX/SEV)", "DLP / Session monitoring"],
                "desc": "Data being processed",
            },
        ]

        panels = VGroup()
        for state in states:
            panel = VGroup()
            box = RoundedRectangle(width=3.5, height=4, corner_radius=0.15,
                                    color=state["color"], fill_opacity=0.1)
            name = Text(state["name"], font_size=22, color=state["color"], weight=BOLD)
            name.next_to(box.get_top(), DOWN, buff=0.2)
            icon = Text(state["icon_text"], font_size=28, color=state["color"])
            icon.next_to(name, DOWN, buff=0.15)
            desc = Text(state["desc"], font_size=14, color=GREY)
            desc.next_to(icon, DOWN, buff=0.15)

            controls_group = VGroup()
            for ctrl in state["controls"]:
                c = Text(f"• {ctrl}", font_size=13, color=WHITE)
                controls_group.add(c)
            controls_group.arrange(DOWN, aligned_edge=LEFT, buff=0.08)
            controls_group.next_to(desc, DOWN, buff=0.2)

            panel.add(box, name, icon, desc, controls_group)
            panels.add(panel)

        panels.arrange(RIGHT, buff=0.3).move_to(ORIGIN + DOWN * 0.3)

        for i, panel in enumerate(panels):
            self.play(FadeIn(panel), run_time=0.8)
            self.wait(0.5)

        self.wait(1)

        # The trap
        self.play(*[FadeOut(m) for m in self.mobjects])

        trap_title = Text("The #1 Domain 2 Trap", font_size=30, color=RED, weight=BOLD).to_edge(UP)
        self.play(Write(trap_title))

        trap_text = VGroup(
            Text("Encryption protects data AT REST", font_size=24, color=BLUE),
            Text("TLS protects data IN TRANSIT", font_size=24, color=GREEN),
            Text("", font_size=8),
            Text("Neither protects data IN USE", font_size=28, color=RED, weight=BOLD),
            Text("", font_size=8),
            Text("The CPU needs plaintext to compute.", font_size=22),
            Text("At-rest encryption stops the moment data enters RAM.", font_size=22),
            Text("TLS stops the moment data is decrypted at the endpoint.", font_size=22),
            Text("", font_size=8),
            Text("Modern answer: Confidential Computing", font_size=24, color=YELLOW),
            Text("Intel SGX/TDX, AMD SEV, AWS Nitro Enclaves", font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.12).move_to(ORIGIN)

        for line in trap_text:
            self.play(FadeIn(line), run_time=0.4)
        self.wait(3)
