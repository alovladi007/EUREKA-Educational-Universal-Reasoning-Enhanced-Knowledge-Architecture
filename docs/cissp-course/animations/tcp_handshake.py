"""
D4-02 — TCP Three-Way Handshake and SYN Flood
Manim Community Edition script. Run: manim -pql tcp_handshake.py TCPHandshake

Storyboard: docs/cissp-course/domain-4/03-storyboards.md §D4-02 and D4-03
"""
from manim import *


class TCPHandshake(Scene):
    def construct(self):
        title = Text("TCP Three-Way Handshake", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Client and Server
        client = VGroup(
            RoundedRectangle(width=1.5, height=0.7, color=GREEN, fill_opacity=0.2),
            Text("Client", font_size=18, color=GREEN),
        )
        client[1].move_to(client[0])
        client.move_to(LEFT * 4 + UP * 1.5)

        server = VGroup(
            RoundedRectangle(width=1.5, height=0.7, color=RED, fill_opacity=0.2),
            Text("Server", font_size=18, color=RED),
        )
        server[1].move_to(server[0])
        server.move_to(RIGHT * 4 + UP * 1.5)

        self.play(FadeIn(client), FadeIn(server))

        # SYN
        y1 = 0.3
        syn = Arrow(LEFT * 3 + UP * y1, RIGHT * 3 + UP * (y1 - 0.2),
                     buff=0, color=GREEN, stroke_width=3)
        syn_label = Text("SYN (seq=X)", font_size=18, color=GREEN).next_to(syn, UP, buff=0.05)
        syn_desc = Text('"I want to connect, my sequence number is X"',
                        font_size=14, color=GREY).next_to(syn, DOWN, buff=0.05)
        self.play(Create(syn), Write(syn_label), Write(syn_desc), run_time=1)
        self.wait(1)

        # SYN-ACK
        y2 = -0.6
        synack = Arrow(RIGHT * 3 + UP * y2, LEFT * 3 + UP * (y2 - 0.2),
                        buff=0, color=RED, stroke_width=3)
        synack_label = Text("SYN-ACK (seq=Y, ack=X+1)", font_size=18, color=RED).next_to(synack, UP, buff=0.05)
        synack_desc = Text('"OK, my sequence is Y, I acknowledge your X+1"',
                           font_size=14, color=GREY).next_to(synack, DOWN, buff=0.05)
        self.play(Create(synack), Write(synack_label), Write(synack_desc), run_time=1)
        self.wait(1)

        # ACK
        y3 = -1.5
        ack = Arrow(LEFT * 3 + UP * y3, RIGHT * 3 + UP * (y3 - 0.2),
                     buff=0, color=GREEN, stroke_width=3)
        ack_label = Text("ACK (ack=Y+1)", font_size=18, color=GREEN).next_to(ack, UP, buff=0.05)
        ack_desc = Text('"Got it. Connection established."',
                        font_size=14, color=GREY).next_to(ack, DOWN, buff=0.05)
        self.play(Create(ack), Write(ack_label), Write(ack_desc), run_time=1)
        self.wait(1)

        # Connected!
        connected = Text("CONNECTION ESTABLISHED", font_size=24,
                          color=YELLOW, weight=BOLD).move_to(DOWN * 2.8)
        self.play(Write(connected))
        self.wait(1.5)

        # Transition to SYN Flood
        self.play(*[FadeOut(m) for m in self.mobjects])

        flood_title = Text("SYN Flood Attack", font_size=36, color=RED).to_edge(UP)
        self.play(Write(flood_title))

        # Attacker sends many SYNs
        attacker = VGroup(
            Circle(radius=0.3, color=RED, fill_opacity=0.5),
            Text("Attacker", font_size=16, color=RED),
        ).arrange(DOWN, buff=0.1).move_to(LEFT * 4 + UP * 1)

        server2 = VGroup(
            RoundedRectangle(width=1.5, height=0.7, color=BLUE, fill_opacity=0.2),
            Text("Server", font_size=18, color=BLUE),
        )
        server2[1].move_to(server2[0])
        server2.move_to(RIGHT * 3 + UP * 1)

        # Connection table
        table = VGroup(
            RoundedRectangle(width=2.5, height=1.5, color=ORANGE, fill_opacity=0.1),
            Text("Connection\nTable", font_size=14, color=ORANGE),
        )
        table[1].move_to(table[0])
        table.move_to(RIGHT * 3 + DOWN * 1.5)

        self.play(FadeIn(attacker), FadeIn(server2), FadeIn(table))

        # Flood of SYNs
        for i in range(5):
            y = 0.5 - i * 0.3
            syn_arrow = Arrow(LEFT * 3 + UP * y, RIGHT * 2 + UP * y,
                              buff=0, color=RED, stroke_width=2)
            self.play(Create(syn_arrow), run_time=0.2)

        flood_label = Text("Millions of SYNs with spoofed IPs",
                           font_size=18, color=RED).move_to(DOWN * 0.5)
        self.play(Write(flood_label))

        # Table fills up
        full_label = Text("TABLE FULL — legitimate clients blocked!",
                           font_size=20, color=RED, weight=BOLD).move_to(DOWN * 2)
        self.play(table[0].animate.set_fill(RED, opacity=0.5), Write(full_label))
        self.wait(1)

        # Defense: SYN Cookies
        self.play(*[FadeOut(m) for m in self.mobjects])

        defense_title = Text("Defense: SYN Cookies", font_size=36, color=GREEN).to_edge(UP)
        self.play(Write(defense_title))

        defense_points = VGroup(
            Text("Server responds SYN-ACK but does NOT allocate state", font_size=20),
            Text("State encoded in the sequence number (cryptographic hash)", font_size=20, color=GREEN),
            Text("Real ACK arrives → server validates cookie → allocates state", font_size=20),
            Text("Attacker can't forge the cookie without seeing the SYN-ACK", font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.3).move_to(ORIGIN)

        for point in defense_points:
            self.play(FadeIn(point), run_time=0.7)
            self.wait(0.5)
        self.wait(2)
