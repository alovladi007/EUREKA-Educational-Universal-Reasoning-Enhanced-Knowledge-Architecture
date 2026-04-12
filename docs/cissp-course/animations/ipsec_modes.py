"""
D4-07 — IPsec Tunnel vs Transport Mode
Run: manim -pql ipsec_modes.py IPsecModes
"""
from manim import *


class IPsecModes(Scene):
    def construct(self):
        title = Text("IPsec: Tunnel vs Transport Mode", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Original packet
        orig_header = RoundedRectangle(width=2, height=0.8, color=BLUE, fill_opacity=0.3)
        orig_header_label = Text("IP Header", font_size=14, color=BLUE).move_to(orig_header)
        orig_payload = RoundedRectangle(width=4, height=0.8, color=GREEN, fill_opacity=0.3)
        orig_payload_label = Text("Payload (Data)", font_size=14, color=GREEN).move_to(orig_payload)
        orig_packet = VGroup(orig_header, orig_payload).arrange(RIGHT, buff=0).move_to(UP * 1.5)
        VGroup(orig_header_label, orig_payload_label).move_to(orig_packet)
        orig_header_label.move_to(orig_header)
        orig_payload_label.move_to(orig_payload)

        orig_label = Text("Original IP Packet", font_size=18, color=WHITE).next_to(orig_packet, LEFT, buff=0.3)
        self.play(FadeIn(orig_packet), FadeIn(orig_header_label), FadeIn(orig_payload_label), Write(orig_label))
        self.wait(1)

        # Transport mode
        transport_label = Text("Transport Mode", font_size=22, color=YELLOW, weight=BOLD).move_to(LEFT * 1 + DOWN * 0.3)

        t_header = RoundedRectangle(width=2, height=0.8, color=BLUE, fill_opacity=0.3)
        t_esp = RoundedRectangle(width=1.2, height=0.8, color=ORANGE, fill_opacity=0.4)
        t_payload = RoundedRectangle(width=4, height=0.8, color=RED, fill_opacity=0.2)
        t_esp_label = Text("ESP", font_size=12, color=ORANGE).move_to(t_esp)
        t_h_label = Text("Original\nIP Header", font_size=10, color=BLUE).move_to(t_header)
        t_p_label = Text("Encrypted Payload", font_size=12, color=RED).move_to(t_payload)

        transport_packet = VGroup(t_header, t_esp, t_payload).arrange(RIGHT, buff=0).move_to(DOWN * 0.5)

        t_desc = Text("Original IP header kept; ESP protects payload only", font_size=14, color=GREY).next_to(transport_packet, DOWN, buff=0.1)
        t_use = Text("Use case: host-to-host encryption", font_size=14, color=YELLOW).next_to(t_desc, DOWN, buff=0.05)

        self.play(Write(transport_label))
        self.play(FadeIn(transport_packet), FadeIn(t_esp_label), FadeIn(t_h_label), FadeIn(t_p_label))
        self.play(Write(t_desc), Write(t_use))
        self.wait(1.5)

        # Tunnel mode
        self.play(FadeOut(transport_packet), FadeOut(transport_label),
                  FadeOut(t_desc), FadeOut(t_use),
                  FadeOut(t_esp_label), FadeOut(t_h_label), FadeOut(t_p_label))

        tunnel_label = Text("Tunnel Mode", font_size=22, color=GREEN, weight=BOLD).move_to(LEFT * 1 + DOWN * 0.3)

        new_header = RoundedRectangle(width=1.8, height=0.8, color=TEAL, fill_opacity=0.4)
        new_esp = RoundedRectangle(width=1, height=0.8, color=ORANGE, fill_opacity=0.4)
        enc_orig = RoundedRectangle(width=5, height=0.8, color=RED, fill_opacity=0.2)
        new_h_label = Text("New\nIP Header", font_size=10, color=TEAL).move_to(new_header)
        new_esp_label = Text("ESP", font_size=12, color=ORANGE).move_to(new_esp)
        enc_label = Text("Encrypted: [Orig IP Header + Payload]", font_size=11, color=RED).move_to(enc_orig)

        tunnel_packet = VGroup(new_header, new_esp, enc_orig).arrange(RIGHT, buff=0).move_to(DOWN * 0.5)

        tu_desc = Text("Entire original packet encrypted inside new IP packet", font_size=14, color=GREY).next_to(tunnel_packet, DOWN, buff=0.1)
        tu_use = Text("Use case: site-to-site VPN between gateways", font_size=14, color=GREEN).next_to(tu_desc, DOWN, buff=0.05)

        self.play(Write(tunnel_label))
        self.play(FadeIn(tunnel_packet), FadeIn(new_h_label), FadeIn(new_esp_label), FadeIn(enc_label))
        self.play(Write(tu_desc), Write(tu_use))
        self.wait(1.5)

        # Summary
        self.play(*[FadeOut(m) for m in self.mobjects])

        summary = VGroup(
            Text("IPsec Mode Summary", font_size=28, color=BLUE, weight=BOLD),
            Text("", font_size=8),
            Text("Transport Mode:", font_size=22, color=YELLOW, weight=BOLD),
            Text("• Keeps original IP header", font_size=20),
            Text("• ESP between header and payload", font_size=20),
            Text("• Host-to-host encryption", font_size=20),
            Text("", font_size=8),
            Text("Tunnel Mode:", font_size=22, color=GREEN, weight=BOLD),
            Text("• New IP header wraps everything", font_size=20),
            Text("• Entire original packet encrypted", font_size=20),
            Text("• Site-to-site VPN (between gateways)", font_size=20),
            Text("", font_size=8),
            Text("AH authenticates. ESP encrypts (and can authenticate).",
                 font_size=20, color=GREY),
        ).arrange(DOWN, buff=0.1).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
