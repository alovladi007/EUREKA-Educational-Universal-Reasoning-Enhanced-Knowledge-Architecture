"""
D3-05 — Symmetric vs Asymmetric Crypto: When to use which
Run: manim -pql symmetric_vs_asymmetric.py SymmetricVsAsymmetric
"""
from manim import *


class SymmetricVsAsymmetric(Scene):
    def construct(self):
        title = Text("Symmetric vs Asymmetric Cryptography", font_size=32, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Symmetric side
        sym_title = Text("Symmetric", font_size=26, color=GREEN, weight=BOLD).move_to(LEFT * 3.5 + UP * 1.8)
        sym_desc = Text("Same key encrypts & decrypts", font_size=16, color=GREEN).next_to(sym_title, DOWN, buff=0.1)

        # Visual: one key shared between Alice and Bob
        alice_sym = VGroup(
            Circle(radius=0.3, color=BLUE, fill_opacity=0.3),
            Text("Alice", font_size=12),
        ).arrange(DOWN, buff=0.05).move_to(LEFT * 5 + DOWN * 0.2)
        bob_sym = VGroup(
            Circle(radius=0.3, color=BLUE, fill_opacity=0.3),
            Text("Bob", font_size=12),
        ).arrange(DOWN, buff=0.05).move_to(LEFT * 2 + DOWN * 0.2)
        key_sym = Text("K", font_size=28, color=YELLOW, weight=BOLD).move_to(LEFT * 3.5 + DOWN * 0.2)
        key_box = SurroundingRectangle(key_sym, color=YELLOW, buff=0.1)

        speed_label = Text("FAST (1000x)", font_size=16, color=GREEN).move_to(LEFT * 3.5 + DOWN * 1.2)
        sym_examples = Text("AES-256, ChaCha20", font_size=14, color=GREY).next_to(speed_label, DOWN, buff=0.1)
        sym_use = Text("Bulk data encryption", font_size=14, color=GREY).next_to(sym_examples, DOWN, buff=0.05)

        self.play(Write(sym_title), Write(sym_desc))
        self.play(FadeIn(alice_sym), FadeIn(bob_sym), Write(key_sym), Create(key_box))
        self.play(Write(speed_label), Write(sym_examples), Write(sym_use))
        self.wait(1)

        # Asymmetric side
        asym_title = Text("Asymmetric", font_size=26, color=PURPLE, weight=BOLD).move_to(RIGHT * 3.5 + UP * 1.8)
        asym_desc = Text("Key pair: public + private", font_size=16, color=PURPLE).next_to(asym_title, DOWN, buff=0.1)

        alice_asym = VGroup(
            Circle(radius=0.3, color=BLUE, fill_opacity=0.3),
            Text("Alice", font_size=12),
        ).arrange(DOWN, buff=0.05).move_to(RIGHT * 2 + DOWN * 0.2)
        bob_asym = VGroup(
            Circle(radius=0.3, color=BLUE, fill_opacity=0.3),
            Text("Bob", font_size=12),
        ).arrange(DOWN, buff=0.05).move_to(RIGHT * 5 + DOWN * 0.2)

        pub_key = Text("PUB", font_size=18, color=GREEN).move_to(RIGHT * 3.5 + UP * 0.2)
        priv_key = Text("PRIV", font_size=18, color=RED).move_to(RIGHT * 3.5 + DOWN * 0.6)
        pub_box = SurroundingRectangle(pub_key, color=GREEN, buff=0.05)
        priv_box = SurroundingRectangle(priv_key, color=RED, buff=0.05)

        speed_label2 = Text("SLOW (1000x slower)", font_size=16, color=RED).move_to(RIGHT * 3.5 + DOWN * 1.2)
        asym_examples = Text("RSA, ECDH, EdDSA", font_size=14, color=GREY).next_to(speed_label2, DOWN, buff=0.1)
        asym_use = Text("Key exchange & signatures", font_size=14, color=GREY).next_to(asym_examples, DOWN, buff=0.05)

        self.play(Write(asym_title), Write(asym_desc))
        self.play(FadeIn(alice_asym), FadeIn(bob_asym),
                  Write(pub_key), Create(pub_box), Write(priv_key), Create(priv_box))
        self.play(Write(speed_label2), Write(asym_examples), Write(asym_use))
        self.wait(1.5)

        # Divider
        divider = DashedLine(UP * 2 + ORIGIN, DOWN * 2.5 + ORIGIN, color=GREY)
        self.play(Create(divider))
        self.wait(1)

        # Hybrid
        self.play(*[FadeOut(m) for m in self.mobjects])

        hybrid_title = Text("Real-World: HYBRID", font_size=32, color=YELLOW, weight=BOLD).to_edge(UP)
        self.play(Write(hybrid_title))

        hybrid_steps = VGroup(
            Text("1. Asymmetric key exchange (ECDH)", font_size=22, color=PURPLE),
            Text("   → Establish a shared symmetric session key", font_size=20, color=GREY),
            Text("", font_size=6),
            Text("2. Symmetric encryption (AES-GCM)", font_size=22, color=GREEN),
            Text("   → Encrypt the actual data (fast!)", font_size=20, color=GREY),
            Text("", font_size=6),
            Text("This is how TLS, IPsec, SSH, Signal,", font_size=20, color=YELLOW),
            Text("and every modern protocol works.", font_size=20, color=YELLOW),
        ).arrange(DOWN, buff=0.1).move_to(ORIGIN)

        for line in hybrid_steps:
            self.play(FadeIn(line), run_time=0.4)
        self.wait(1.5)

        # One-liner summary
        self.play(*[FadeOut(m) for m in self.mobjects])
        summary = VGroup(
            Text("The One Sentence:", font_size=28, color=BLUE, weight=BOLD),
            Text("", font_size=8),
            Text("Symmetric for BULK encryption.", font_size=26, color=GREEN),
            Text("Asymmetric for KEY EXCHANGE and SIGNATURES.", font_size=26, color=PURPLE),
            Text("", font_size=8),
            Text("This covers 80% of CISSP crypto questions.", font_size=22, color=YELLOW),
        ).arrange(DOWN, buff=0.15).move_to(ORIGIN)
        self.play(FadeIn(summary))
        self.wait(3)
