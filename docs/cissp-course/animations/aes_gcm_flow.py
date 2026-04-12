"""
D3-07 — AEAD in One Slide: AES-GCM Flow
Manim Community Edition script. Run: manim -pql aes_gcm_flow.py AESGCMFlow

Storyboard: docs/cissp-course/domain-3/03-storyboards.md §D3-07
"""
from manim import *


class AESGCMFlow(Scene):
    def construct(self):
        title = Text("AES-GCM: Authenticated Encryption", font_size=36, color=BLUE).to_edge(UP)
        self.play(Write(title))

        # Inputs
        inputs_label = Text("Inputs:", font_size=20, color=GREY).move_to(LEFT * 5 + UP * 1.5)
        plaintext = VGroup(
            RoundedRectangle(width=2, height=0.6, color=GREEN, fill_opacity=0.3),
            Text("Plaintext", font_size=16, color=GREEN),
        )
        plaintext[1].move_to(plaintext[0])
        plaintext.next_to(inputs_label, DOWN, buff=0.2)

        key = VGroup(
            RoundedRectangle(width=1.5, height=0.6, color=YELLOW, fill_opacity=0.3),
            Text("Key", font_size=16, color=YELLOW),
        )
        key[1].move_to(key[0])
        key.next_to(plaintext, DOWN, buff=0.2)

        nonce = VGroup(
            RoundedRectangle(width=1.5, height=0.6, color=ORANGE, fill_opacity=0.3),
            Text("Nonce", font_size=16, color=ORANGE),
        )
        nonce[1].move_to(nonce[0])
        nonce.next_to(key, DOWN, buff=0.2)

        aad = VGroup(
            RoundedRectangle(width=1.5, height=0.6, color=PURPLE, fill_opacity=0.3),
            Text("AAD", font_size=16, color=PURPLE),
        )
        aad[1].move_to(aad[0])
        aad.next_to(nonce, DOWN, buff=0.2)

        self.play(FadeIn(inputs_label), FadeIn(plaintext),
                  FadeIn(key), FadeIn(nonce), FadeIn(aad))
        self.wait(1)

        # Processing
        ctr_box = VGroup(
            RoundedRectangle(width=2.5, height=1, color=BLUE, fill_opacity=0.2),
            Text("AES-CTR\nEncrypt", font_size=16, color=BLUE),
        )
        ctr_box[1].move_to(ctr_box[0])
        ctr_box.move_to(ORIGIN + UP * 1)

        ghash_box = VGroup(
            RoundedRectangle(width=2.5, height=1, color=RED, fill_opacity=0.2),
            Text("GHASH\nAuthenticate", font_size=16, color=RED),
        )
        ghash_box[1].move_to(ghash_box[0])
        ghash_box.move_to(ORIGIN + DOWN * 0.5)

        self.play(FadeIn(ctr_box), FadeIn(ghash_box))

        # Arrows from inputs to processing
        a1 = Arrow(plaintext.get_right(), ctr_box.get_left(), buff=0.1, color=GREEN, stroke_width=2)
        a2 = Arrow(key.get_right(), ctr_box.get_left() + DOWN * 0.2, buff=0.1, color=YELLOW, stroke_width=2)
        a3 = Arrow(nonce.get_right(), ctr_box.get_left() + DOWN * 0.4, buff=0.1, color=ORANGE, stroke_width=2)
        a4 = Arrow(aad.get_right(), ghash_box.get_left(), buff=0.1, color=PURPLE, stroke_width=2)
        self.play(Create(a1), Create(a2), Create(a3), Create(a4), run_time=0.8)
        self.wait(0.5)

        # Outputs
        ciphertext = VGroup(
            RoundedRectangle(width=2, height=0.6, color=BLUE, fill_opacity=0.3),
            Text("Ciphertext", font_size=16, color=BLUE),
        )
        ciphertext[1].move_to(ciphertext[0])
        ciphertext.move_to(RIGHT * 4 + UP * 1)

        tag = VGroup(
            RoundedRectangle(width=2, height=0.6, color=RED, fill_opacity=0.3),
            Text("Auth Tag", font_size=16, color=RED),
        )
        tag[1].move_to(tag[0])
        tag.move_to(RIGHT * 4 + DOWN * 0.5)

        a5 = Arrow(ctr_box.get_right(), ciphertext.get_left(), buff=0.1, color=BLUE, stroke_width=2)
        a6 = Arrow(ghash_box.get_right(), tag.get_left(), buff=0.1, color=RED, stroke_width=2)
        # Ciphertext also feeds into GHASH
        a7 = Arrow(ctr_box.get_bottom(), ghash_box.get_top(), buff=0.1, color=BLUE_B, stroke_width=2)

        self.play(Create(a5), Create(a6), Create(a7),
                  FadeIn(ciphertext), FadeIn(tag), run_time=1)
        self.wait(1)

        # Output bundle
        output_label = Text("Output: Ciphertext + Tag + Nonce", font_size=20,
                            color=YELLOW).move_to(DOWN * 2.5)
        self.play(Write(output_label))
        self.wait(1)

        # Warning
        self.play(*[FadeOut(m) for m in self.mobjects])

        warning = VGroup(
            Text("CRITICAL WARNING", font_size=32, color=RED, weight=BOLD),
            Text("Never reuse a nonce with the same key in GCM.", font_size=24, color=RED),
            Text("Nonce reuse allows recovery of the auth key", font_size=22),
            Text("and forging of arbitrary ciphertexts.", font_size=22),
            Text("", font_size=10),
            Text("AES-GCM provides:", font_size=24, color=GREEN),
            Text("Confidentiality + Integrity + Authenticity", font_size=22, color=GREEN),
            Text("in one primitive, one pass.", font_size=22, color=GREEN),
        ).arrange(DOWN, buff=0.2).move_to(ORIGIN)

        self.play(FadeIn(warning))
        self.wait(3)
