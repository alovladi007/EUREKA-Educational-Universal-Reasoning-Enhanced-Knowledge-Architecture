#!/usr/bin/env python3
"""Seed the AuroraBorealisPhotonics video-course catalogue (11 courses).

Each course is a placeholder shell today: published so it appears in the
public catalogue (/explore) and resolves through /dashboard/courses/by-code,
with an honest "About this course" reading that says the video lectures are
in production. Video lectures will be attached later as course_content rows
of content_type 'video' whose metadata.file_path points at an object in the
file-storage service (course-media/{course_id}/...), uploaded directly to
the platform — not embedded from YouTube.

Idempotent: courses are keyed by code (INSERT if missing + UPDATE in place),
and the About reading is keyed by (course, title).

Usage (stack must be up):
    python3 scripts/seed_video_courses.py
"""
from __future__ import annotations

import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]

q = lambda s: s.replace("'", "''")  # noqa: E731

SERIES_NOTE = (
    "Part of the AuroraBorealisPhotonics lecture series. Video lectures are "
    "produced and uploaded directly to EUREKA; companion readings and "
    "problem sets follow the platform's standard course format."
)

COURSES = [
    {
        "code": "NANO-QOPT",
        "title": "NanoPhotonics and Quantum Optics",
        "subject": "Electrical Engineering",
        "category": "Photonics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "Light confined below the wavelength: photonic crystals, plasmonics, optical microcavities and waveguide QED, then the quantum optics to use them — field quantization, coherent and squeezed states, emitter-cavity coupling, and single-photon devices.",
    },
    {
        "code": "SSTATE-PHY",
        "title": "Solid State Physics",
        "subject": "physics",
        "category": "Condensed Matter",
        "level": "advanced",
        "tier": "graduate",
        "desc": "The crystal foundations underneath every device course: lattices and diffraction, phonons, free-electron and nearly-free-electron models, band structure, semiconductors, magnetism and superconductivity.",
    },
    {
        "code": "PHOT-COMM",
        "title": "Photonics: Optical Electronics in Modern Communication",
        "subject": "Electrical Engineering",
        "category": "Photonics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "The optoelectronics of the fiber link: waveguides and fiber propagation, laser diodes and modulators, photodetectors and receivers, amplification, and the system budgets that connect device physics to bit-error rate.",
    },
    {
        "code": "PHOT-SENS",
        "title": "Photonic Devices and Sensors",
        "subject": "Electrical Engineering",
        "category": "Photonics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "Photonics applied to measurement: interferometric and fiber-optic sensors, resonant and evanescent-field devices, photonic integrated sensing circuits, and readout electronics — with the noise and calibration budgets that decide what is actually detectable.",
    },
    {
        "code": "PWR-SEMI",
        "title": "Power Semiconductor Devices",
        "subject": "Electrical Engineering",
        "category": "Electronics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "Devices that switch kilowatts: PiN diodes, power MOSFETs, IGBTs and thyristors, safe operating areas, switching loss and thermal design, and the wide-bandgap (SiC, GaN) generation rewriting the trade-offs.",
    },
    {
        "code": "SEMI-TRANS",
        "title": "Physics of Semiconductor and Devices: Transistors",
        "subject": "Electrical Engineering",
        "category": "Electronics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "The transistor in depth: bipolar junction devices, MOS electrostatics and the MOSFET, short-channel effects and scaling, and the small-signal and switching models that connect device physics to circuit behaviour.",
    },
    {
        "code": "SEMI-PHYS",
        "title": "Physics of Semiconductor and Devices",
        "subject": "Electrical Engineering",
        "category": "Electronics",
        "level": "advanced",
        "tier": "graduate",
        "desc": "Semiconductor fundamentals from carrier statistics to working junctions: bands and doping, drift-diffusion transport, generation-recombination, the pn junction, metal-semiconductor contacts and heterojunctions.",
    },
    {
        "code": "PHYS-MATL",
        "title": "Physics and Materials Properties",
        "subject": "physics",
        "category": "Materials",
        "level": "advanced",
        "tier": "graduate",
        "desc": "How structure becomes properties: bonding and crystal structure, defects, and the electrical, optical, thermal, magnetic and mechanical behaviour of the materials that electronics and photonics are built from.",
    },
    {
        "code": "OPTM-APPL",
        "title": "Optical Metrology: Practical Applications",
        "subject": "Electrical Engineering",
        "category": "Metrology",
        "level": "advanced",
        "tier": "graduate",
        "desc": "Optical measurement in the field and the fab: surface and form metrology, alignment and stage metrology, thin-film and wafer inspection, and the uncertainty budgets that make a measurement defensible.",
    },
    {
        "code": "OPTM-PRIN",
        "title": "Optical Metrology: Principles and Techniques for Metrology",
        "subject": "Electrical Engineering",
        "category": "Metrology",
        "level": "advanced",
        "tier": "graduate",
        "desc": "The principles under every optical measurement: interferometry, diffraction and moire techniques, phase-shifting and heterodyne detection, speckle methods, and traceability to the meter.",
    },
    {
        "code": "OPTM-ELEM",
        "title": "Optical Metrology: Optical Elements and Devices",
        "subject": "Electrical Engineering",
        "category": "Metrology",
        "level": "advanced",
        "tier": "graduate",
        "desc": "The instrument builder's parts bin: sources and detectors for metrology, lenses, mirrors and coatings, polarization elements, gratings and interferometer architectures — and how element imperfections become measurement error.",
    },
]


def main() -> None:
    sql = ["BEGIN;"]
    for c in COURSES:
        syllabus = json.dumps({"chapters": []}).replace("'", "''")
        meta = (
            "jsonb_build_object("
            "'content_status', 'in_production', "
            "'delivery', 'video+reading', "
            f"'series', 'AuroraBorealisPhotonics', "
            f"'series_note', '{q(SERIES_NOTE)}')"
        )
        sql.append(f"""
INSERT INTO courses (org_id, title, code, description, tier, subject, category, level,
                     syllabus, status, is_published, metadata)
SELECT o.id, '{q(c['title'])}', '{c['code']}', '{q(c['desc'])}',
       '{c['tier']}', '{q(c['subject'])}', '{q(c['category'])}', '{c['level']}',
       '{syllabus}'::jsonb, 'published', true, {meta}
FROM organizations o
ORDER BY (SELECT count(*) FROM users u WHERE u.org_id = o.id) DESC LIMIT 1
ON CONFLICT DO NOTHING;
""")
        sql.append(f"""
UPDATE courses SET title = '{q(c['title'])}', description = '{q(c['desc'])}',
       tier = '{c['tier']}', subject = '{q(c['subject'])}', category = '{q(c['category'])}',
       level = '{c['level']}', status = 'published', is_published = true,
       metadata = COALESCE(metadata, '{{}}'::jsonb) || {meta}
WHERE code = '{c['code']}';
""")
        about_title = "About this course"
        about_body = q(
            f"# {c['title']}\n\n{c['desc']}\n\n"
            "## Format\n\n"
            "This course is delivered as a **video lecture series with companion readings**, "
            "produced by AuroraBorealisPhotonics and hosted directly on EUREKA.\n\n"
            "## Status\n\n"
            "The lecture videos are currently **in production**. This page will fill in as "
            "modules are published — check back, or start another course in the "
            "Engineering & Physical Sciences family while you wait."
        )
        sql.append(f"""
INSERT INTO course_content (course_id, content_type, title, content, topics, metadata)
SELECT c.id, 'reading', '{about_title}', '{about_body}', '[]'::jsonb,
       jsonb_build_object('chapter', '0', 'order', 0, 'authored', true, 'origin', 'original')
FROM courses c WHERE c.code = '{c['code']}'
  AND NOT EXISTS (SELECT 1 FROM course_content cc
                  WHERE cc.course_id = c.id AND cc.title = '{about_title}');
""")
    sql.append("COMMIT;")

    proc = subprocess.run(
        ["docker", "compose", "exec", "-T", "db", "psql", "-U", "eureka", "-d", "eureka",
         "-v", "ON_ERROR_STOP=1"],
        input="\n".join(sql), text=True, capture_output=True, cwd=ROOT,
    )
    if proc.returncode != 0:
        raise SystemExit(f"seed failed:\n{proc.stderr[-2000:]}")
    print(proc.stdout[-200:])
    print(f"seeded: {len(COURSES)} video courses (placeholder shells, published)")


if __name__ == "__main__":
    main()
