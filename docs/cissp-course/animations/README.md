# CISSP Course Animations — Manim Scripts

Runnable [Manim Community Edition](https://www.manim.community/) scripts
that produce MP4 animations from the storyboards.

## Prerequisites

```bash
pip install manim
```

## Scripts

| Script | Storyboard | Description | Duration |
|---|---|---|---|
| `risk_math_machine.py` | D1-05 | AV → EF → SLE → ARO → ALE pipeline with worked example | ~2.5 min |
| `kerberos_flow.py` | D5-04 | Kerberos AS-REQ → TGT → TGS-REQ → Service Ticket flow | ~2.5 min |
| `tls13_handshake.py` | D4-06 | TLS 1.3 one-RTT handshake with key properties | ~2 min |
| `aes_gcm_flow.py` | D3-07 | AES-GCM AEAD: inputs → CTR encrypt + GHASH → outputs | ~2 min |
| `tcp_handshake.py` | D4-02/03 | TCP three-way handshake + SYN flood + SYN cookies defense | ~3 min |

## Render

```bash
# Low quality (fast preview)
manim -pql risk_math_machine.py RiskMathMachine

# High quality (production)
manim -pqh risk_math_machine.py RiskMathMachine

# All scripts
for f in *.py; do manim -pqh "$f"; done
```

Output goes to `media/videos/`.

## Remaining storyboards

The following storyboards from the course specify After Effects, Lottie,
or Excalidraw and are not included as Manim scripts (they need a motion
designer):

- D1-01 through D1-04, D1-06 through D1-12 (After Effects / Lottie)
- D2-01 through D2-10
- D3-01 through D3-04, D3-08 through D3-14
- D4-01, D4-04, D4-05, D4-07 through D4-12
- D5-01 through D5-03, D5-06 through D5-10
- D6-01 through D6-08
- D7-01 through D7-08
- D8-01 through D8-08
