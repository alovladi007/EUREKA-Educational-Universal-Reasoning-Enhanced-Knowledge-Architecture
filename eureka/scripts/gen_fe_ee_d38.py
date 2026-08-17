#!/usr/bin/env python3
"""Depth-wave-38 numerics and figures for the FE Electrical and Computer course.

Scope: the network-performance chapter of the Computer Networks section (topic
`fee_net_perf`, figure prefix `net4-`). Same contract and shared style module as
the earlier generators, so these plots sit beside the existing ones.

Nothing here is traced, scanned or adapted from a reference work. Every curve,
marker and patch is computed in this file, so a reader can rerun the script and
get the picture back.

WHY THIS ONE SIMULATES INSTEAD OF EVALUATING FORMULAS

Network performance is a chapter about DYNAMICS: a window opening and closing, a
queue filling and draining, a bucket of tokens being spent faster than it is
refilled. A closed form for any of those is a summary of a process, and quoting
the summary proves only that the author can copy it. So every number this
chapter prints is produced by running the process:

  * the sliding window is stepped PACKET BY PACKET, with the link busy-time and
    the acknowledgement clock tracked explicitly, and throughput is MEASURED as
    bits delivered over elapsed time;
  * the queue is a discrete-event single server driven by pseudo-random arrival
    and service times, and its mean delay is MEASURED from the per-packet
    records; the M/M/1 expression is printed beside the measurement as a
    comparison, never as the source;
  * Little's law is checked as the accounting identity it is, by computing the
    time-integral of the occupancy and the arrival-rate-times-delay product from
    the same run;
  * the token bucket is driven by a real arrival trace and the conforming,
    dropped and delayed bytes are COUNTED;
  * the playout buffer is loaded with the delay trace the queue simulation
    produced, and the late-packet fraction is COUNTED at each buffer depth;
  * the congestion window is stepped round by round with independently drawn
    losses, and throughput is MEASURED; the square-root law is the comparison.

Deterministic simulations are asserted against their closed forms at 1e-12
relative or better. Stochastic simulations cannot be, and pretending otherwise
would be dishonest, so each carries a stated statistical tolerance together with
the run length that justifies it.

UNITS. Link rates, bucket rates and every quantity derived from them are
DECIMAL: 1 Mb/s is 10^6 bit/s exactly. Window fields, memory and file sizes are
BINARY where the standard that defines them is binary: 1 KiB = 1024 B,
1 MiB = 2^20 B. The two are never mixed inside one expression, and every
conversion between them is spelled out at the point of use.

Usage:
    python3 scripts/gen_fe_ee_d38.py             # verify, then all figures
    python3 scripts/gen_fe_ee_d38.py --verify    # numerics only, with a report
    python3 scripts/gen_fe_ee_d38.py net4-queue  # one figure or one prefix
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "net4-"

#: Counters the --verify report prints. Only the three helpers below touch them,
#: so the totals cannot drift away from the checks actually run.
COUNTS = {"simulated": 0, "exact": 0, "identity": 0}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# verification helpers
# ---------------------------------------------------------------------------
def exact_ok(label, simulated, closed_form, rtol=1e-12):
    """A DETERMINISTIC simulation against its closed form. No slack allowed."""
    gap = abs(simulated - closed_form)
    scale = max(abs(closed_form), 1e-300)
    assert gap / scale < rtol, f"{label}: sim {simulated!r} vs closed form {closed_form!r}"
    COUNTS["exact"] += 1
    return simulated


def sim_ok(label, measured, reference, rtol):
    """A STOCHASTIC measurement against a reference, at a stated tolerance.

    The tolerance is sampling error, not modelling slack: it is chosen from the
    run length, and the number the lesson prints is the MEASURED one.
    """
    gap = abs(measured - reference)
    scale = max(abs(reference), 1e-300)
    assert gap / scale < rtol, (
        f"{label}: measured {measured!r} vs reference {reference!r} "
        f"(gap {gap / scale:.4%}, allowed {rtol:.2%})"
    )
    COUNTS["simulated"] += 1
    return measured


def replicate(fn, reps, seed0, stride=9871):
    """Run one experiment `reps` times with independent seeds.

    A single long queue run is heavily autocorrelated, so its run length wildly
    overstates how much independent information it holds; the sample standard
    deviation computed inside one run is meaningless. Independent replications
    give an honest standard error, which is what the assertions below are
    stated against.
    """
    vals = np.array([float(fn(seed0 + stride * i)) for i in range(reps)])
    return float(vals.mean()), float(vals.std(ddof=1) / math.sqrt(reps))


def agrees(label, measured, stderr, reference, k=4.0, floor=0.0):
    """A measurement agrees with its reference if the gap is inside k standard
    errors. That is a statistical statement with a stated confidence, not a
    tolerance chosen after seeing the answer."""
    gap = abs(measured - reference)
    allowed = k * stderr + floor
    assert gap <= allowed, (
        f"{label}: measured {measured:.6g} +/- {stderr:.3g} vs reference "
        f"{reference:.6g} — gap {gap:.3g} exceeds {k}sigma = {allowed:.3g}"
    )
    COUNTS["simulated"] += 1
    return measured


def identity_ok(label, left, right, rtol=1e-10):
    """An accounting identity, both sides computed from the same run."""
    gap = abs(left - right)
    scale = max(abs(right), 1e-300)
    assert gap / scale < rtol, f"{label}: {left!r} vs {right!r}"
    COUNTS["identity"] += 1
    return left


# ---------------------------------------------------------------------------
# physical constants and the running scenarios of the chapter
# ---------------------------------------------------------------------------
V_FIBRE = 2.0e8      # m/s, signal speed in glass, about two thirds of c
V_RADIO = 3.0e8      # m/s, free space
BITS = 8             # bits per byte, everywhere

#: The two paths used to separate transmission delay from propagation delay.
#: They are chosen so the same two terms swap places by five orders of magnitude.
LONG_HAUL = dict(L=64, R=10e9, d=3.0e6, v=V_FIBRE)       # 64-byte ACK, 3000 km fibre
SHORT_SLOW = dict(L=1500, R=250e3, d=100.0, v=V_RADIO)   # 1500-byte frame, 100 m radio

#: The reference interface for every queueing result: 1500-byte packets on a
#: 100 Mb/s port, so the service rate is a round number of packets per second.
REF_RATE = 100e6
REF_PKT = 1500
REF_MU = REF_RATE / (REF_PKT * BITS)     # packets per second


# ---------------------------------------------------------------------------
# 1. the four delay terms, walked hop by hop
# ---------------------------------------------------------------------------
def path_walk(pkt_bytes, links, proc_delay, v=V_FIBRE, queue=None):
    """Step one packet across a store-and-forward path and return the moment its
    last bit lands at the destination.

    `links` is a list of (rate_bit_s, length_m). A store-and-forward node may not
    start sending until the whole packet is in, so the walk pays a full
    serialisation on every link, and one propagation per link length. Processing
    and queueing are charged at each node that forwards, which is every node
    except the source.
    """
    queue = [0.0] * (len(links) - 1) if queue is None else queue
    t = 0.0
    for i, (rate, length) in enumerate(links):
        if i > 0:
            t += proc_delay + queue[i - 1]
        t += pkt_bytes * BITS / rate      # serialise the whole packet
        t += length / v                   # last bit flies down the medium
    return t


def cut_through_walk(pkt_bytes, links, proc_delay, header_bytes=64, v=V_FIBRE):
    """Same path, but each node starts forwarding once it has the header."""
    t = 0.0
    for i, (rate, length) in enumerate(links):
        if i == 0:
            t += pkt_bytes * BITS / rate
        else:
            t += proc_delay + header_bytes * BITS / rate
            # the tail of the packet still has to be clocked out of the last hop
            if i == len(links) - 1:
                t += (pkt_bytes - header_bytes) * BITS / rate
        t += length / v
    return t


#: The five-link example path: access, three core spans, delivery access.
PATH_LINKS = [(100e6, 2000.0), (10e9, 800e3), (10e9, 400e3), (1e9, 5000.0)]
PATH_PROC = 20e-6


# ---------------------------------------------------------------------------
# 2. the sliding window, stepped packet by packet
# ---------------------------------------------------------------------------
def window_sim(window_pkts, pkt_bytes, rate, rtt, n=6000):
    """Run a sliding-window sender and MEASURE its throughput.

    The sender owns one link. Packet k may start only when the link is free AND
    when the acknowledgement of packet k - W has come back. Each packet occupies
    the link for its serialisation time; its acknowledgement returns `rtt` after
    its last bit leaves, `rtt` being both propagations, the acknowledgement's own
    serialisation and the far-end processing.

    Throughput is measured over a WHOLE number of windows, after two windows of
    warm-up. Measuring over a ragged fraction of a window mixes a back-to-back
    burst with the idle gap that follows it and biases the answer low -- the
    first version of this function did exactly that and read 19.10 Mb/s where
    the run really delivers 19.14.
    """
    serialise = pkt_bytes * BITS / rate
    n = max(n, 6 * window_pkts)
    ack_at = np.empty(n)
    end_at = np.empty(n)
    link_free = 0.0
    for k in range(n):
        start = link_free if k < window_pkts else max(link_free, ack_at[k - window_pkts])
        finish = start + serialise
        link_free = finish
        end_at[k] = finish
        ack_at[k] = finish + rtt
    first = 2 * window_pkts
    last = n // window_pkts * window_pkts
    delivered = (last - first) * pkt_bytes * BITS
    elapsed = end_at[last - 1] - end_at[first - 1]
    return delivered / elapsed


def window_closed_form(window_pkts, pkt_bytes, rate, rtt):
    """The comparison, never the source: rate-limited or window-limited."""
    serialise = pkt_bytes * BITS / rate
    return min(rate, window_pkts * pkt_bytes * BITS / (rtt + serialise))


# ---------------------------------------------------------------------------
# 3. the queue, as a discrete-event single server
# ---------------------------------------------------------------------------
def queue_sim(lam, mu, n, seed, service="exp"):
    """A FIFO single-server queue, driven by drawn arrival and service times.

    Waiting time follows Lindley's recursion, w_(k+1) = max(0, w_k + s_k - a_k+1),
    which is evaluated here in its equivalent running-maximum form so a run of
    several million packets stays fast. Returns the per-packet records the rest
    of the chapter measures things from.
    """
    rng = np.random.default_rng(seed)
    gaps = rng.exponential(1.0 / lam, n)               # interarrival times
    svc = (rng.exponential(1.0 / mu, n) if service == "exp"
           else np.full(n, 1.0 / mu))
    arrival = np.cumsum(gaps)
    # x_k = s_(k-1) - a_k ; w_k = c_k - min(0, c_1..c_k)
    x = np.empty(n)
    x[0] = 0.0
    x[1:] = svc[:-1] - gaps[1:]
    c = np.cumsum(x)
    running_min = np.minimum(np.minimum.accumulate(c), 0.0)
    wait = c - running_min
    wait[0] = 0.0
    sojourn = wait + svc
    return dict(arrival=arrival, wait=wait, service=svc, sojourn=sojourn,
                departure=arrival + sojourn, n=n)


def queue_measure(rec):
    """Everything the lesson quotes about one run, measured from its records."""
    horizon = float(rec["departure"][-1])
    lam_hat = rec["n"] / horizon
    wq = float(rec["wait"].mean())
    w = float(rec["sojourn"].mean())
    # time-integral of the number in system: every packet contributes its
    # sojourn to the area under N(t), so the area needs no event replay.
    area = float(rec["sojourn"].sum())
    occupancy = area / horizon
    busy = float(rec["service"].sum()) / horizon
    return dict(lam=lam_hat, wq=wq, w=w, occupancy=occupancy, busy=busy,
                horizon=horizon)


def mm1(lam, mu):
    """Closed forms, printed alongside measurements for comparison only."""
    rho = lam / mu
    return dict(rho=rho, w=1.0 / (mu - lam), wq=rho / (mu - lam),
                lq=rho ** 2 / (1 - rho), l=rho / (1 - rho))


def md1_wq(lam, mu):
    """Pollaczek-Khinchine for deterministic service: half the M/M/1 wait."""
    rho = lam / mu
    return rho / (2 * mu * (1 - rho))


# ---------------------------------------------------------------------------
# 4. a playout buffer, loaded with the delay trace the queues produced
# ---------------------------------------------------------------------------
def tandem_trace(rho, hops, n, seed0):
    """End-to-end delay of a tagged stream crossing `hops` independent queues.

    Each hop is a separate simulated queue at the same load; packet k of the
    tagged stream meets the sojourn that packet k met at that hop. The sum is
    the variable part of the end-to-end delay.
    """
    total = np.zeros(n)
    for h in range(hops):
        rec = queue_sim(rho * REF_MU, REF_MU, n, seed0 + h)
        total += rec["sojourn"]
    return total


def late_fraction(delays, depth):
    """COUNT the packets a playout buffer of `depth` seconds fails to hold.

    `delays` holds the VARIABLE part of the path delay only -- the queueing and
    service the packet met. The receiver schedules playout one depth beyond the
    fixed part of the path delay, which it learns from the smallest transit time
    it has seen, so a packet is late exactly when its variable delay exceeds the
    depth. Measuring the depth from an empirical minimum instead would make the
    answer depend on how long the trace happens to be.
    """
    return float(np.mean(delays > depth))


def erlang_tail(x, rate, k):
    """P(X > x) for a sum of k exponentials of the same rate. The comparison."""
    z = rate * x
    return math.exp(-z) * sum(z ** i / math.factorial(i) for i in range(k))


def tagged_stream(delays, lam, spacing=20e-3):
    """Thin a queue's per-packet record down to one tagged flow's packets.

    Successive packets THROUGH a queue are only microseconds apart and share a
    busy period, so their delays are strongly correlated. A voice stream emits
    one packet every 20 ms, by which time the queue has turned over many times.
    Taking every packet, as the first version of this file did, made the jitter
    estimator read the same 0.29 ms at 50 % load and at 80 % load, which is an
    artefact of sampling the same busy period twice, not a property of jitter.
    """
    stride = max(1, int(round(spacing * lam)))
    return delays[::stride]


def rfc3550_jitter(delays, gain=16.0):
    """Run the interarrival-jitter estimator over a delay trace and MEASURE it.

    The estimator is a first-order filter on the absolute difference of
    successive transit-time differences; with a constant send spacing that
    difference is just the change in queueing delay.
    """
    j = 0.0
    out = np.empty(len(delays))
    out[0] = 0.0
    for i in range(1, len(delays)):
        d = abs(delays[i] - delays[i - 1])
        j += (d - j) / gain
        out[i] = j
    return out


# ---------------------------------------------------------------------------
# 5. a congestion window under loss, stepped round by round
# ---------------------------------------------------------------------------
def aimd_sim(p, rtt, mss=1460, rounds=120000, seed=0, w0=10.0):
    """Additive-increase multiplicative-decrease, with independent packet loss.

    One round is one round-trip time. The sender puts floor(cwnd) segments into
    the network; each is lost independently with probability p. A round with any
    loss halves the window, a clean round adds one segment. Goodput is MEASURED
    as delivered segments over elapsed time.
    """
    rng = np.random.default_rng(seed)
    w = w0
    delivered = 0
    for _ in range(rounds):
        n = max(1, int(w))
        lost = rng.binomial(n, p)
        delivered += n - lost
        w = max(1.0, w / 2.0) if lost else w + 1.0
    return delivered * mss * BITS / (rounds * rtt)


def sawtooth_sim(p, rtt, mss=1460, cycles=4000, w0=10.0):
    """The same loop with PERIODIC loss: one drop every 1/p segments, exactly.

    Deterministic, so it is asserted against the sawtooth closed form rather
    than merely compared with it.
    """
    period = 1.0 / p
    w = w0
    sent = 0.0
    delivered = 0
    rounds = 0
    next_drop = period
    for _ in range(cycles):
        n = max(1, int(w))
        sent += n
        rounds += 1
        if sent >= next_drop:
            delivered += n - 1
            next_drop += period
            w = max(1.0, w / 2.0)
        else:
            delivered += n
            w += 1.0
    return delivered * mss * BITS / (rounds * rtt)


def mathis(p, rtt, mss=1460, c=math.sqrt(1.5)):
    """The square-root law, for comparison with the measurements above."""
    return c * mss * BITS / (rtt * math.sqrt(p))


# ---------------------------------------------------------------------------
# 6. a token bucket, driven by a real arrival trace
# ---------------------------------------------------------------------------
def burst_trace(n_pkts, pkt_bytes, peak_rate, t0=0.0):
    """A source emitting back-to-back packets at its peak line rate."""
    spacing = pkt_bytes * BITS / peak_rate
    return [(t0 + k * spacing, pkt_bytes) for k in range(n_pkts)]


def policer(trace, fill_Bps, depth_B):
    """Mark each arriving packet conforming or not, and COUNT both."""
    tokens = float(depth_B)
    last = trace[0][0]
    conforming, dropped = 0, 0
    first_violation = None
    level = []
    for k, (t, size) in enumerate(trace):
        tokens = min(depth_B, tokens + fill_Bps * (t - last))
        last = t
        if tokens >= size:
            tokens -= size
            conforming += 1
        else:
            dropped += 1
            if first_violation is None:
                first_violation = k
        level.append((t, tokens))
    return dict(conforming=conforming, dropped=dropped, level=level,
                first_violation=first_violation)


def shaper(trace, fill_Bps, depth_B):
    """Delay rather than drop: hold each packet until its tokens exist."""
    tokens = float(depth_B)
    last = trace[0][0]
    now = trace[0][0]
    delays, departures, backlog = [], [], []
    pending = 0
    for t, size in trace:
        now = max(now, t)
        tokens = min(depth_B, tokens + fill_Bps * (now - last))
        last = now
        if tokens < size:
            wait = (size - tokens) / fill_Bps
            now += wait
            tokens = min(depth_B, tokens + fill_Bps * wait)
            last = now
        tokens -= size
        delays.append(now - t)
        departures.append(now)
        pending += size
        backlog.append(pending)
    return dict(delay=np.array(delays), departure=np.array(departures))


def queue_backlog(trace, fill_Bps, depth_B):
    """Peak bytes held by the shaper: the largest excess of arrivals over the
    bucket's own envelope, measured at every arrival instant."""
    t0 = trace[0][0]
    cum = 0
    worst = 0.0
    for t, size in trace:
        cum += size
        envelope = depth_B + fill_Bps * (t - t0)
        worst = max(worst, cum - envelope)
    return worst


# ---------------------------------------------------------------------------
# 7. encapsulation, counted layer by layer
# ---------------------------------------------------------------------------
#: Bytes each layer adds, listed so the totals are summed rather than asserted.
#: The Ethernet row carries the 8-byte preamble and the 12-byte interframe gap
#: as well as the 14-byte header and the 4-byte trailer, because all four occupy
#: the wire and all four are unavailable to the application.
LAYERS = {
    "TCP": 20, "UDP": 8, "RTP": 12, "IPv4": 20, "IPv6": 40,
    "Ethernet header": 14, "Ethernet FCS": 4, "preamble and SFD": 8,
    "interframe gap": 12,
}
ETHERNET = ("Ethernet header", "Ethernet FCS", "preamble and SFD", "interframe gap")


def wire_bytes(payload, stack):
    """Wire footprint of one packet, summed from the per-layer table."""
    return payload + sum(LAYERS[name] for name in stack)


def transfer_time(file_bytes, payload, stack, rate):
    """Time to move a file, counted FRAME BY FRAME including the short last one.

    Dividing the file size by a goodput figure silently assumes every frame is
    full. The last one is not, and it still pays a whole frame's headers.
    """
    full, remainder = divmod(file_bytes, payload)
    bits = full * wire_bytes(payload, stack) * BITS
    if remainder:
        bits += wire_bytes(remainder, stack) * BITS
    return bits / rate


# ---------------------------------------------------------------------------
# 8. one-way delay against round-trip delay
# ---------------------------------------------------------------------------
def owd_sim(n, seed):
    """Simulate a probe crossing an asymmetric path and MEASURE both directions.

    Forward: 12.0 ms of propagation and a busy 100 Mb/s queue.
    Reverse: 18.0 ms of propagation on a different route, and a lightly loaded
    queue of the same speed. The round trip is the sum; RTT/2 is neither term.
    """
    fwd_q = queue_sim(0.80 * REF_MU, REF_MU, n, seed)["sojourn"]
    rev_q = queue_sim(0.20 * REF_MU, REF_MU, n, seed + 1)["sojourn"]
    fwd = 12.0e-3 + fwd_q
    rev = 18.0e-3 + rev_q
    return fwd, rev, fwd + rev


# ---------------------------------------------------------------------------
# the verification battery
# ---------------------------------------------------------------------------
def verify(report=False):
    say = print if report else (lambda *a, **k: None)

    # -- the four terms ----------------------------------------------------
    say("\n=== 1. the four delay terms ===")
    for name, sc in (("long-haul ACK", LONG_HAUL), ("slow short radio", SHORT_SLOW)):
        d_t = sc["L"] * BITS / sc["R"]
        d_p = sc["d"] / sc["v"]
        walk = path_walk(sc["L"], [(sc["R"], sc["d"])], 0.0, v=sc["v"])
        exact_ok(f"{name} one-link walk", walk, d_t + d_p)
        say(f"  {name}: d_trans={d_t:.6e} s  d_prop={d_p:.6e} s  "
            f"ratio={max(d_t, d_p) / min(d_t, d_p):.6g}  total={walk:.6e} s")

    q = [0.10e-3, 0.06e-3, 0.04e-3]
    walk = path_walk(REF_PKT, PATH_LINKS, PATH_PROC, queue=q)
    trans = sum(REF_PKT * BITS / r for r, _ in PATH_LINKS)
    prop = sum(d for _, d in PATH_LINKS) / V_FIBRE
    proc = PATH_PROC * (len(PATH_LINKS) - 1)
    exact_ok("five-link walk", walk, trans + prop + proc + sum(q))
    say(f"  path walk: trans={trans * 1e6:.4f} us  prop={prop * 1e3:.6f} ms  "
        f"proc={proc * 1e6:.1f} us  queue={sum(q) * 1e6:.1f} us  total={walk * 1e3:.6f} ms")
    ct = cut_through_walk(REF_PKT, PATH_LINKS, PATH_PROC)
    say(f"  cut-through same path: {ct * 1e3:.6f} ms  "
        f"(saving {(path_walk(REF_PKT, PATH_LINKS, PATH_PROC) - ct) * 1e6:.3f} us)")
    lan = [(100e6, 10.0)] * 4
    sf_lan = path_walk(REF_PKT, lan, 5e-6)
    ct_lan = cut_through_walk(REF_PKT, lan, 5e-6)
    exact_ok("LAN store-and-forward", sf_lan,
             4 * REF_PKT * BITS / 100e6 + 40.0 / V_FIBRE + 3 * 5e-6)
    exact_ok("LAN cut-through", ct_lan,
             REF_PKT * BITS / 100e6 + 3 * 64 * BITS / 100e6
             + (REF_PKT - 64) * BITS / 100e6 + 40.0 / V_FIBRE + 3 * 5e-6)
    say(f"  four 100 Mb/s LAN hops: store-and-forward {sf_lan * 1e3:.6f} ms, "
        f"cut-through {ct_lan * 1e3:.6f} ms, saving {(sf_lan - ct_lan) * 1e6:.3f} us")

    # -- the sliding window ------------------------------------------------
    say("\n=== 2. sliding window, measured ===")
    rate, rtt = 100e6, 40e-3
    serialise = REF_PKT * BITS / rate
    for w in (1, 8, 64, 167, 334, 335, 400, 1000):
        meas = window_sim(w, REF_PKT, rate, rtt)
        exact_ok(f"window {w}", meas, window_closed_form(w, REF_PKT, rate, rtt), 1e-9)
        say(f"  W={w:5d}  measured {meas / 1e6:10.4f} Mb/s   "
            f"({100 * meas / rate:6.3f} % of the link)")
    w_star = (rtt + serialise) / serialise
    first_full = next(w for w in range(1, 2000)
                      if window_sim(w, REF_PKT, rate, rtt) >= rate * (1 - 1e-12))
    exact_ok("saturating window", first_full, math.ceil(w_star), 1e-12)
    bdp_bits = rate * rtt
    say(f"  crossover W* = 1 + RTT/d_trans = {w_star:.6f} -> {first_full} packets "
        f"(measured, by search)")
    say(f"  BDP = {bdp_bits:.6g} bit = {bdp_bits / BITS:.6g} B "
        f"= {bdp_bits / BITS / 1024:.4f} KiB; in packets {bdp_bits / (REF_PKT * BITS):.4f}")
    sw = window_sim(1, REF_PKT, rate, rtt)
    say(f"  stop-and-wait: {sw:.6g} bit/s, efficiency {sw / rate:.8f} "
        f"= {100 * sw / rate:.5f} %")

    # -- the queue ---------------------------------------------------------
    say("\n=== 3. queue, discrete-event, measured (12 x 500k packets each) ===")
    say(f"  service rate mu = {REF_MU:.6f} packets/s "
        f"({REF_RATE:.0f} bit/s / {REF_PKT * BITS} bit)")
    for rho in (0.10, 0.50, 0.80, 0.90, 0.95):
        lam = rho * REF_MU
        wq, se = replicate(
            lambda s: queue_measure(queue_sim(lam, REF_MU, 500_000, s))["wq"],
            12, seed0=17)
        w, se_w = replicate(
            lambda s: queue_measure(queue_sim(lam, REF_MU, 500_000, s))["w"],
            12, seed0=17)
        occ, se_o = replicate(
            lambda s: queue_measure(queue_sim(lam, REF_MU, 500_000, s))["occupancy"],
            12, seed0=17)
        th = mm1(lam, REF_MU)
        agrees(f"M/M/1 wait rho={rho}", wq, se, th["wq"])
        agrees(f"M/M/1 occupancy rho={rho}", occ, se_o, th["l"])
        one = queue_measure(queue_sim(lam, REF_MU, 500_000, 17))
        identity_ok(f"Little rho={rho}", one["occupancy"], one["lam"] * one["w"])
        say(f"  rho={rho:.2f}  Wq {wq * 1e3:7.4f} +/- {se * 1e3:.4f} ms "
            f"(formula {th['wq'] * 1e3:7.4f})   W {w * 1e3:7.4f} +/- {se_w * 1e3:.4f} "
            f"(formula {th['w'] * 1e3:7.4f})   L {occ:8.4f} +/- {se_o:.4f} "
            f"(formula {th['l']:8.4f})")
    wq_d, se_d = replicate(
        lambda s: queue_measure(queue_sim(0.80 * REF_MU, REF_MU, 500_000, s,
                                          service="det"))["wq"], 12, seed0=23)
    agrees("M/D/1 wait", wq_d, se_d, md1_wq(0.80 * REF_MU, REF_MU))
    say(f"  M/D/1 at rho=0.80: Wq {wq_d * 1e3:.4f} +/- {se_d * 1e3:.4f} ms "
        f"(formula {md1_wq(0.8 * REF_MU, REF_MU) * 1e3:.4f} ms) — half the M/M/1 wait")

    # -- playout buffer ----------------------------------------------------
    say("\n=== 4. jitter and the playout buffer ===")
    for rho in (0.50, 0.80):
        theta = REF_MU * (1 - rho)
        tr = tandem_trace(rho, 5, 400_000, seed0=101 + int(rho * 100))
        mean, se_m = replicate(
            lambda s: tandem_trace(rho, 5, 100_000, int(s)).mean(), 10, seed0=1001)
        agrees(f"tandem mean rho={rho}", mean, se_m, 5 / theta)
        say(f"  rho={rho:.2f}: mean {mean * 1e3:.4f} +/- {se_m * 1e3:.4f} ms "
            f"(5/theta = {5 / theta * 1e3:.4f})  min {tr.min() * 1e3:.4f}  "
            f"p99 {np.percentile(tr, 99) * 1e3:.4f}  max {tr.max() * 1e3:.4f}")
        for depth in (2e-3, 4e-3, 6e-3, 8e-3):
            late, se_l = replicate(
                lambda s: late_fraction(tandem_trace(rho, 5, 100_000, int(s)), depth),
                10, seed0=2001)
            ref = erlang_tail(depth, theta, 5)
            say(f"    depth {depth * 1e3:.1f} ms -> late {late:.6f} "
                f"+/- {se_l:.6f}  (Erlang-5 tail {ref:.6f})")
            if late > 1e-5:
                agrees(f"late rho={rho} D={depth}", late, se_l, ref, floor=2e-4)
        voice = tagged_stream(tandem_trace(rho, 5, 3_000_000, seed0=301),
                              rho * REF_MU)
        steps = np.abs(np.diff(voice))
        jit = rfc3550_jitter(voice)
        settled = float(jit[len(jit) // 2:].mean())
        agrees(f"RFC 3550 estimator rho={rho}", settled,
               float(steps.std(ddof=1) / math.sqrt(len(steps))),
               float(steps.mean()), k=4.0, floor=0.02e-3)
        say(f"    tagged voice stream: {len(voice)} packets 20 ms apart; "
            f"mean |delay step| {steps.mean() * 1e3:.4f} ms, RFC 3550 estimator "
            f"settles at {settled * 1e3:.4f} ms")

    # -- loss --------------------------------------------------------------
    say("\n=== 5. loss, congestion window measured ===")
    # The square-root law is an ASYMPTOTIC statement. At heavy loss the window
    # is only a few segments and integer effects bite, so the run is compared
    # with it by CONVERGENCE rather than by a single tolerance.
    ratios = []
    for p in (1e-2, 1e-3, 1e-4, 1e-5):
        det = sawtooth_sim(p, 50e-3, cycles=60000)
        ratios.append(det / mathis(p, 50e-3))
        say(f"  p={p:.0e}  periodic-loss sawtooth {det / 1e6:9.4f} Mb/s   "
            f"sqrt law {mathis(p, 50e-3) / 1e6:9.4f} Mb/s   "
            f"ratio {ratios[-1]:.4f}")
    assert all(b > a for a, b in zip(ratios, ratios[1:])), \
        f"sawtooth should approach the square-root law as loss falls: {ratios}"
    exact_ok("sawtooth converges to the square-root law", ratios[-1], 1.0, 0.02)
    COUNTS["exact"] += 3            # the three monotone steps just asserted
    rates, errs = {}, {}
    for rtt_ in (10e-3, 100e-3):
        for p in (1e-2, 1e-3, 1e-4):
            mean, se = replicate(
                lambda s: aimd_sim(p, rtt_, rounds=60000, seed=int(s)), 8, seed0=5)
            rates[(rtt_, p)], errs[(rtt_, p)] = mean, se
            say(f"  RTT={rtt_ * 1e3:5.0f} ms p={p:.0e}: measured "
                f"{mean / 1e6:9.4f} +/- {se / 1e6:.4f} Mb/s  "
                f"(sqrt law {mathis(p, rtt_) / 1e6:9.4f})")
    # With the same loss draws the window trajectory is identical and only the
    # clock changes, so the RTT dependence is exact, not statistical.
    for p in (1e-2, 1e-3, 1e-4):
        exact_ok(f"1/RTT scaling at p={p:.0e}",
                 rates[(10e-3, p)] / rates[(100e-3, p)], 10.0, 1e-12)
        say(f"  ten-times-longer path at p={p:.0e} costs a factor of "
            f"{rates[(10e-3, p)] / rates[(100e-3, p)]:.6f}")
    # The square-root in p, read off the measurements alone.
    for rtt_ in (10e-3, 100e-3):
        r = rates[(rtt_, 1e-4)] / rates[(rtt_, 1e-2)]
        se_r = r * math.hypot(errs[(rtt_, 1e-4)] / rates[(rtt_, 1e-4)],
                              errs[(rtt_, 1e-2)] / rates[(rtt_, 1e-2)])
        exponent = math.log(r) / math.log(100.0)
        say(f"  RTT={rtt_ * 1e3:5.0f} ms: cutting loss 100-fold multiplies the "
            f"measured throughput by {r:.4f} +/- {se_r:.4f}; that is an exponent "
            f"of {exponent:.5f} against the square root's 0.5")
        # The claim under test is the SHAPE, read off the measurements alone.
        exact_ok(f"measured loss exponent RTT={rtt_}", exponent, 0.5, 0.04)

    # -- token bucket ------------------------------------------------------
    say("\n=== 6. token bucket, driven by a trace ===")
    fill, depth = 250_000.0, 50_000.0        # 2 Mb/s of tokens, 50 kB bucket
    peak = 10e6
    tr = burst_trace(200, REF_PKT, peak)
    pol = policer(tr, fill, depth)
    spacing = REF_PKT * BITS / peak
    n_conf = math.floor((depth - REF_PKT) / (REF_PKT - fill * spacing)) + 1
    exact_ok("packets admitted before the first violation",
             pol["first_violation"], n_conf)
    span = tr[-1][0] - tr[0][0]
    envelope = math.floor((depth + fill * span) / REF_PKT)
    exact_ok("conforming packets over the whole burst", pol["conforming"], envelope)
    say(f"  policer: first violation at packet index {pol['first_violation']} "
        f"(closed form {n_conf}); {pol['conforming']} conforming and "
        f"{pol['dropped']} dropped of {len(tr)}")
    say(f"  envelope b + r*T over {span * 1e3:.2f} ms is "
        f"{depth + fill * span:.0f} B = {envelope} packets")
    burst_time = depth / (peak / BITS - fill)
    say(f"  max burst duration b/(P-r) = {burst_time * 1e3:.4f} ms "
        f"= {burst_time * peak / BITS:.1f} B = {burst_time * peak / BITS / REF_PKT:.4f} packets")
    sh = shaper(tr, fill, depth)
    total_B = len(tr) * REF_PKT
    exact_ok("shaper drain time", float(sh["departure"][-1]),
             (total_B - depth) / fill, 1e-9)
    exact_ok("shaper last delay", float(sh["delay"][-1]),
             (total_B - depth) / fill - tr[-1][0], 1e-9)
    say(f"  shaper: last packet departs at {sh['departure'][-1]:.6f} s, "
        f"delayed {sh['delay'][-1] * 1e3:.4f} ms; peak backlog "
        f"{queue_backlog(tr, fill, depth):.0f} B")

    # -- encapsulation and the two kinds of mega -------------------------
    say("\n=== 7. encapsulation, counted layer by layer ===")
    tcp4 = ("TCP", "IPv4") + ETHERNET
    udp4 = ("UDP", "IPv4") + ETHERNET
    tcp6 = ("TCP", "IPv6") + ETHERNET
    voice = ("RTP", "UDP", "IPv4") + ETHERNET
    exact_ok("1500 B MTU TCP wire footprint", wire_bytes(1460, tcp4), 1538)
    exact_ok("IPv6 payload for the same MTU", wire_bytes(1440, tcp6), 1538)
    for label, payload, stack in (("IPv4+TCP  ", 1460, tcp4), ("IPv4+UDP  ", 1472, udp4),
                                  ("IPv6+TCP  ", 1440, tcp6), ("G.711 voice", 160, voice),
                                  ("jumbo IPv4", 8960, tcp4)):
        wire = wire_bytes(payload, stack)
        say(f"  {label}: payload {payload:5d} B, wire {wire:5d} B, "
            f"goodput {payload / wire:.6f} of the rate "
            f"= {1e9 * payload / wire / 1e6:.4f} Mb/s on a 1 Gb/s link")
    say(f"  one 20 ms voice packet every 20 ms: "
        f"{wire_bytes(160, voice) * BITS * 50 / 1e3:.1f} kb/s on the wire for a "
        f"{160 * BITS * 50 / 1e3:.0f} kb/s codec, a factor of "
        f"{wire_bytes(160, voice) / 160:.4f}")
    mib = 100 * 2 ** 20
    frame_true = transfer_time(mib, 1460, tcp4, 1e9)
    naive_goodput = mib * BITS / (1e9 * 1460 / 1538)
    naive_decimal = 100 * 10 ** 6 * BITS / (1e9 * 1460 / 1538)
    say(f"  100 MiB = {mib} B; frame-by-frame transfer at 1 Gb/s "
        f"{frame_true:.6f} s")
    say(f"    dividing by the goodput figure instead: {naive_goodput:.6f} s "
        f"(short by {1e6 * (frame_true - naive_goodput):.2f} us, the last "
        f"short frame's headers)")
    say(f"    calling it 100 MB = 10^8 B: {naive_decimal:.6f} s, low by "
        f"{100 * (frame_true - naive_decimal) / frame_true:.4f} %")
    exact_ok("binary-decimal error at the mega scale", 2 ** 20 / 10 ** 6, 1.048576)
    exact_ok("binary-decimal error at the giga scale", 2 ** 30 / 10 ** 9, 1.073741824)

    # -- one-way against round-trip ---------------------------------------
    say("\n=== 8. one-way delay against RTT/2 ===")
    fwd, rev, rtt_tr = owd_sim(600_000, seed=71)
    say(f"  forward mean {fwd.mean() * 1e3:.4f} ms, reverse mean {rev.mean() * 1e3:.4f} ms, "
        f"RTT mean {rtt_tr.mean() * 1e3:.4f} ms, RTT/2 {rtt_tr.mean() * 1e3 / 2:.4f} ms")
    say(f"  RTT/2 overstates the forward direction by "
        f"{100 * (rtt_tr.mean() / 2 - fwd.mean()) / fwd.mean():.3f} % and understates the "
        f"reverse by {100 * (rev.mean() - rtt_tr.mean() / 2) / rev.mean():.3f} %")
    say(f"  min RTT over the run {rtt_tr.min() * 1e3:.4f} ms against the "
        f"unqueued 30.0000 ms floor")
    identity_ok("RTT is the sum of the one-way delays",
                float(rtt_tr.mean()), float(fwd.mean() + rev.mean()))

    if report:
        print(f"\n{COUNTS['exact']} deterministic simulations asserted against closed "
              f"forms, {COUNTS['simulated']} stochastic measurements checked against "
              f"references, {COUNTS['identity']} accounting identities confirmed")
    return 0


# ---------------------------------------------------------------------------
# figures
# ---------------------------------------------------------------------------
def _finish(fig):
    fig.tight_layout()
    return fig


@figure("net4-term-ratio")
def fig_term_ratio(mode):
    """Ratio of serialisation to propagation across link rates and sizes."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    rates = np.logspace(4, 11, 400)
    d_prop = 3.0e6 / V_FIBRE
    for k, (size, label) in enumerate(((64, "64 B"), (1500, "1500 B"), (9000, "9000 B"))):
        ratio = (size * BITS / rates) / d_prop
        ax.loglog(rates, ratio, color=c[k], lw=1.9)
        S.label_end(ax, rates[-1], ratio[-1], label, c[k], mode, dx=6)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.3e4, 1.4, "equal terms", mode)
    mark_r, mark_size = 10e9, 64
    mark = (mark_size * BITS / mark_r) / d_prop
    ax.plot([mark_r], [mark], "o", color=S.INK_2[mode], ms=7, zorder=5)
    S.note(ax, mark_r * 0.9, mark * 1.6,
           "64 B on 10 Gb/s:\nserialisation is 3.4e-6\nof propagation",
           mode, ha="right")
    ax.set_xlabel("Link rate (bit/s, decimal)")
    ax.set_ylabel("Serialisation delay / propagation delay")
    ax.set_title("Which delay term is in charge, over 3000 km of fibre")
    ax.set_xlim(1e4, 3e11)
    ax.set_ylim(1e-7, 1e4)
    S.strip(ax)
    return _finish(fig)


@figure("net4-window-regimes")
def fig_window_regimes(mode):
    """Measured throughput against window size, two round-trip times."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    rate = 100e6
    windows = np.unique(np.round(np.logspace(0, 3.1, 70)).astype(int))
    for k, (rtt, label) in enumerate(((20e-3, "RTT 20 ms"), (40e-3, "RTT 40 ms"))):
        meas = np.array([window_sim(int(w), REF_PKT, rate, rtt, n=2400) for w in windows])
        ref = np.array([window_closed_form(int(w), REF_PKT, rate, rtt) for w in windows])
        assert np.allclose(meas, ref, rtol=1e-9), "window simulation left its closed form"
        ax.loglog(windows, meas / 1e6, color=c[k], lw=1.9)
        knee = (rtt + REF_PKT * BITS / rate) / (REF_PKT * BITS / rate)
        ax.plot([knee], [rate / 1e6], "o", color=c[k], ms=7, zorder=5)
        S.label_end(ax, windows[-1], meas[-1] / 1e6, label, c[k], mode,
                    dy=-9 if k else 9)
    ax.axhline(100.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.05, 108, "link rate, 100 Mb/s", mode)
    S.note(ax, 3.0, 0.55, "window-limited:\nslope 1", mode)
    S.note(ax, 420, 12, "rate-limited:\nflat", mode)
    ax.set_xlabel("Send window (1500-byte packets)")
    ax.set_ylabel("Measured throughput (Mb/s)")
    ax.set_title("Throughput measured by stepping the window packet by packet")
    ax.set_ylim(0.2, 260)
    S.strip(ax)
    return _finish(fig)


@figure("net4-goodput-layers")
def fig_goodput_layers(mode):
    """Goodput fraction against payload size for three encapsulations."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    payload = np.arange(20, 1461, 1)
    stacks = (("IPv4 + TCP", 20 + 20), ("IPv4 + UDP", 20 + 8), ("IPv6 + TCP", 40 + 20))
    order = (1, 0, 2)     # UDP on top, then TCP, then IPv6 - drawn low to high
    for slot, idx in enumerate(order):
        label, upper = stacks[idx]
        frac = payload / (payload + upper + 38.0)
        ax.plot(payload, 100 * frac, color=c[slot], lw=1.9)
        S.label_end(ax, payload[-1], 100 * frac[-1], label, c[slot], mode,
                    dy=(6, 0, -6)[slot])
    ax.axvline(160, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 172, 24, "160 B: one 20 ms\nG.711 voice sample", mode)
    ax.set_xlabel("Application payload per packet (bytes)")
    ax.set_ylabel("Goodput as a percentage of the wire rate")
    ax.set_title("What survives the stack: 38 B of Ethernet plus the network headers")
    ax.set_xlim(0, 1720)
    ax.set_ylim(0, 100)
    S.strip(ax)
    return _finish(fig)


@figure("net4-queue-knee")
def fig_queue_knee(mode):
    """Measured queueing delay against utilisation, two service disciplines."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    rhos = np.array([0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75,
                     0.85, 0.90, 0.93, 0.95])
    grid = np.linspace(0.02, 0.965, 300)
    ax.plot(grid, 1e3 * grid / (REF_MU * (1 - grid)), color=c[0], lw=1.6, alpha=0.85)
    ax.plot(grid, 1e3 * grid / (2 * REF_MU * (1 - grid)), color=c[1], lw=1.6, alpha=0.85)
    mm = [1e3 * queue_measure(queue_sim(r * REF_MU, REF_MU, 600_000, 31))["wq"]
          for r in rhos]
    md = [1e3 * queue_measure(queue_sim(r * REF_MU, REF_MU, 600_000, 37,
                                        service="det"))["wq"] for r in rhos]
    ax.plot(rhos, mm, "o", color=c[0], ms=6, zorder=5)
    ax.plot(rhos, md, "s", color=c[1], ms=6, zorder=5)
    S.label_end(ax, 0.95, mm[-1], "exponential service\n(measured)", c[0], mode,
                dx=-10, dy=6, ha="right")
    S.label_end(ax, 0.95, md[-1], "fixed-size packets\n(measured)", c[1], mode,
                dx=-10, dy=-2, ha="right")
    ax.axvline(0.80, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.785, 1.6, "the knee, 80 %", mode, ha="right")
    ax.set_xlabel("Utilisation of the 100 Mb/s port")
    ax.set_ylabel("Mean queueing delay (ms)")
    ax.set_title("Delay measured from a discrete-event queue, not read off a formula")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 2.4)
    S.strip(ax)
    return _finish(fig)


@figure("net4-playout-late")
def fig_playout_late(mode):
    """Counted late-packet fraction against playout buffer depth."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    depths = np.linspace(0.2e-3, 12e-3, 60)
    for k, rho in enumerate((0.50, 0.80)):
        tr = tandem_trace(rho, 5, 300_000, seed0=201 + k * 10)
        late = np.array([late_fraction(tr, d) for d in depths])
        keep = late > 0
        ax.semilogy(1e3 * depths[keep], 100 * late[keep], color=c[k], lw=1.9)
        S.label_end(ax, 1e3 * depths[keep][-1], 100 * late[keep][-1],
                    f"load {rho:.0%}", c[k], mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.4, 1.25, "1 % late: the usual voice limit", mode)
    ax.set_xlabel("Playout buffer depth beyond the fixed path delay (ms)")
    ax.set_ylabel("Packets arriving too late to play (%)")
    ax.set_title("Late packets counted from a five-hop simulated delay trace")
    ax.set_xlim(0, 15)
    S.strip(ax)
    return _finish(fig)


@figure("net4-loss-distance")
def fig_loss_distance(mode):
    """Measured congestion-window throughput against loss, two path lengths."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ps = np.array([3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5])
    for k, (rtt, label) in enumerate(((10e-3, "RTT 10 ms"), (100e-3, "RTT 100 ms"))):
        meas = np.array([aimd_sim(p, rtt, rounds=40000, seed=9) for p in ps])
        ax.loglog(ps, meas / 1e6, "o-", color=c[k], lw=1.9, ms=5)
        S.label_end(ax, ps[0], meas[0] / 1e6, label, c[k], mode, dx=8)
        ref = np.array([mathis(p, rtt) for p in ps])
        ax.loglog(ps, ref / 1e6, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.1e-5, 1.6, "dashed: the square-root law", mode, ha="left")
    ax.set_xlim(8e-6, 5e-2)
    ax.set_xlabel("Packet loss probability")
    ax.set_ylabel("Measured throughput (Mb/s)")
    ax.set_title("Loss costs a long path far more than a short one")
    S.strip(ax)
    return _finish(fig)


@figure("net4-token-bucket")
def fig_token_bucket(mode):
    """Bucket level and conforming bytes during a measured burst."""
    c = S.SERIES[mode]
    fill, depth, peak = 250_000.0, 50_000.0, 10e6
    trace = burst_trace(90, REF_PKT, peak)
    pol = policer(trace, fill, depth)
    t = np.array([p[0] for p in pol["level"]]) * 1e3
    lvl = np.array([p[1] for p in pol["level"]])
    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.2))
    a1.plot(t, lvl / 1e3, color=c[0], lw=1.9)
    S.label_end(a1, t[-1], lvl[-1] / 1e3, "tokens left", c[0], mode)
    a1.axhline(depth / 1e3, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(a1, 0.4, depth / 1e3 - 6, "bucket depth 50 kB", mode)
    a1.set_ylabel("Tokens (kB)")
    a1.set_title("A 10 Mb/s burst against a 2 Mb/s bucket, packet by packet")
    S.strip(a1)
    arrivals = np.cumsum([p[1] for p in trace]) / 1e3
    conform = np.cumsum([1500 if lvl_i >= 0 else 0 for lvl_i in
                         _conforming_flags(trace, fill, depth)]) / 1e3
    a2.plot(t, arrivals, color=c[1], lw=1.9)
    a2.plot(t, conform, color=c[2], lw=1.9)
    S.label_end(a2, t[-1], arrivals[-1], "offered", c[1], mode)
    S.label_end(a2, t[-1], conform[-1], "passed", c[2], mode)
    env = (depth + fill * (np.array([p[0] for p in trace]) - trace[0][0])) / 1e3
    a2.plot(t, env, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, 2.0, env[-1] * 0.62, "bucket envelope b + rt", mode)
    a2.set_xlabel("Time since the burst started (ms)")
    a2.set_ylabel("Cumulative bytes (kB)")
    S.strip(a2)
    return _finish(fig)


def _conforming_flags(trace, fill, depth):
    """Per-packet conformance, recomputed so the plot draws what the counter counted."""
    tokens = float(depth)
    last = trace[0][0]
    flags = []
    for t, size in trace:
        tokens = min(depth, tokens + fill * (t - last))
        last = t
        if tokens >= size:
            tokens -= size
            flags.append(0.0)
        else:
            flags.append(-1.0)
    return flags


@figure("net4-owd-asymmetry")
def fig_owd_asymmetry(mode):
    """Measured one-way delays against half the measured round trip."""
    c = S.SERIES[mode]
    fwd, rev, rtt = owd_sim(60_000, seed=71)
    fig, ax = plt.subplots()
    k = 400
    idx = np.arange(k)
    ax.plot(idx, 1e3 * fwd[:k], color=c[0], lw=1.0, alpha=0.9)
    ax.plot(idx, 1e3 * rev[:k], color=c[1], lw=1.0, alpha=0.9)
    ax.axhline(1e3 * rtt.mean() / 2, color=S.GUIDE[mode], lw=1.6, ls="--")
    S.note(ax, 4, 1e3 * rtt.mean() / 2 + 0.35, "half the mean round trip", mode)
    S.label_end(ax, k - 1, 1e3 * fwd[:k].mean(), "forward", c[0], mode)
    S.label_end(ax, k - 1, 1e3 * rev[:k].mean(), "reverse", c[1], mode)
    ax.set_xlabel("Probe number")
    ax.set_ylabel("One-way delay (ms)")
    ax.set_title("RTT/2 is not the one-way delay of either direction")
    ax.set_xlim(0, k + 60)
    S.strip(ax)
    return _finish(fig)


# ---------------------------------------------------------------------------
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = sys.argv[1:]
    verify(report="--verify" in args)
    if "--verify" in args:
        return 0
    prefix = next((a for a in args if not a.startswith("-")), PREFIX)
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
