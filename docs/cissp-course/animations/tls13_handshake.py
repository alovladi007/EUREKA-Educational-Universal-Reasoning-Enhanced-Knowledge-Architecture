"""
D4-06 — TLS 1.3 Handshake (1-RTT)
Manim Community Edition script. Run: manim -pql tls13_handshake.py TLS13Handshake

Storyboard: docs/cissp-course/domain-4/03-storyboards.md §D4-06
"""
from manim import *


class TLS13Handshake(Scene):
    def construct(self):
        title = Text("TLS 1.3 Handshake (1-RTT)", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Client and Server
        client_box = VGroup(
            RoundedRectangle(width=1.8, height=0.8, corner_radius=0.1,
                             color=GREEN, fill_opacity=0.2),
            Text("Client", font_size=20, color=GREEN),
        )
        client_box[1].move_to(client_box[0])
        client_box.move_to(LEFT * 4.5 + UP * 2)

        server_box = VGroup(
            RoundedRectangle(width=1.8, height=0.8, corner_radius=0.1,
                             color=RED, fill_opacity=0.2),
            Text("Server", font_size=20, color=RED),
        )
        server_box[1].move_to(server_box[0])
        server_box.move_to(RIGHT * 4.5 + UP * 2)

        # Timeline lines
        client_line = DashedLine(client_box.get_bottom(), client_box.get_bottom() + DOWN * 5, color=GREEN)
        server_line = DashedLine(server_box.get_bottom(), server_box.get_bottom() + DOWN * 5, color=RED)

        self.play(FadeIn(client_box), FadeIn(server_box),
                  Create(client_line), Create(server_line))

        # Message 1: ClientHello
        y1 = 0.8
        arrow1 = Arrow(LEFT * 3.5 + UP * y1, RIGHT * 3.5 + UP * (y1 - 0.3),
                        buff=0, color=GREEN, stroke_width=2)
        msg1 = VGroup(
            Text("ClientHello", font_size=16, color=GREEN, weight=BOLD),
            Text("• Supported cipher suites", font_size=12),
            Text("• ECDHE key share", font_size=12),
            Text("• Extensions (SNI, ALPN)", font_size=12),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.05).next_to(arrow1, UP, buff=0.05).shift(LEFT * 0.5)

        self.play(Create(arrow1), FadeIn(msg1), run_time=1)
        self.wait(0.5)

        # Message 2: ServerHello + encrypted extensions
        y2 = -0.5
        arrow2 = Arrow(RIGHT * 3.5 + UP * y2, LEFT * 3.5 + UP * (y2 - 0.3),
                        buff=0, color=RED, stroke_width=2)
        msg2 = VGroup(
            Text("ServerHello + Encrypted", font_size=16, color=RED, weight=BOLD),
            Text("• Server ECDHE key share", font_size=12),
            Text("• Server certificate", font_size=12),
            Text("• CertificateVerify (signature)", font_size=12),
            Text("• Finished", font_size=12),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.05).next_to(arrow2, UP, buff=0.05).shift(RIGHT * 0.5)

        self.play(Create(arrow2), FadeIn(msg2), run_time=1)
        self.wait(0.5)

        # Message 3: Client Finished
        y3 = -1.8
        arrow3 = Arrow(LEFT * 3.5 + UP * y3, RIGHT * 3.5 + UP * (y3 - 0.2),
                        buff=0, color=GREEN, stroke_width=2)
        msg3 = VGroup(
            Text("Client Finished", font_size=16, color=GREEN, weight=BOLD),
            Text("• Verify server cert chain", font_size=12),
            Text("• Derive shared secret", font_size=12),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.05).next_to(arrow3, UP, buff=0.05).shift(LEFT * 0.5)

        self.play(Create(arrow3), FadeIn(msg3), run_time=1)
        self.wait(0.5)

        # Application data
        y4 = -2.8
        arrow4 = Arrow(LEFT * 3.5 + UP * y4, RIGHT * 3.5 + UP * y4,
                        buff=0, color=YELLOW, stroke_width=3)
        arrow4b = Arrow(RIGHT * 3.5 + UP * (y4 - 0.3), LEFT * 3.5 + UP * (y4 - 0.3),
                         buff=0, color=YELLOW, stroke_width=3)
        app_label = Text("Application Data (AEAD encrypted)", font_size=16,
                         color=YELLOW, weight=BOLD).next_to(arrow4, UP, buff=0.1)

        self.play(Create(arrow4), Create(arrow4b), Write(app_label), run_time=1)
        self.wait(1)

        # Key points
        self.play(*[FadeOut(m) for m in [msg1, msg2, msg3, arrow1, arrow2, arrow3,
                                          arrow4, arrow4b, app_label,
                                          client_line, server_line]])

        points = VGroup(
            Text("TLS 1.3 Key Properties:", font_size=24, color=BLUE, weight=BOLD),
            Text("• Forward secrecy mandatory (ECDHE only)", font_size=20, color=GREEN),
            Text("• 1-RTT handshake (was 2-RTT in TLS 1.2)", font_size=20),
            Text("• AEAD-only cipher suites (AES-GCM, ChaCha20)", font_size=20),
            Text("• Removed: static RSA, CBC, SHA-1, RC4, compression", font_size=20, color=RED),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).move_to(ORIGIN + DOWN * 0.5)

        self.play(FadeIn(points))
        self.wait(3)
