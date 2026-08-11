"""OCTET -> MCAT wiring (Phase B): mapping table, attempt log, product SKUs.

octet_mcat_map is the versioned, SME-reviewable mapping from OCTET curriculum
nodes to AAMC MCAT content categories. It is data, not code: every row
carries a rationale and review='pending' until a named SME confirms it, and
rows are versioned rather than edited away. The seed below maps the nodes
OCTET can currently teach or practise onto Foundational Concepts 4 and 5.
Placements follow the AAMC content outline; the handful that could sit in
more than one category say so in their rationale, which is exactly what the
review column is for.

mcat_chem_attempts logs every MCAT-mode chemistry response with its OCTET
node and AAMC category, which is what the weakness analytics aggregate. It
is an own-account record; nothing here supports a percentile and none is
computed.

Two product rows are seeded: MCAT full access, and standalone OCTET
chemistry. Serving MCAT-mode chemistry accepts either entitlement (the MCAT
product includes OCTET chemistry; the standalone stays available). Prices
are planning prices, adjustable in the products table, same as the Patent
Bar seed.

Revision ID: mcat_octet_001
Revises: billing_001
Create Date: 2026-08-10
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "mcat_octet_001"
down_revision = "billing_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "octet_mcat_map",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("octet_node", sa.String(length=64), nullable=False),
        sa.Column("octet_node_title", sa.String(length=200), nullable=False),
        sa.Column("mcat_category", sa.String(length=8), nullable=False),
        sa.Column("foundational_concept", sa.String(length=8), nullable=False),
        sa.Column("rationale", sa.String(length=500), nullable=False),
        sa.Column("review", sa.String(length=16), nullable=False, server_default="pending"),
        sa.Column("reviewer", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("octet_node", "mcat_category", "version",
                            name="uq_octet_mcat_node_cat_version"),
    )
    op.create_index("ix_octet_mcat_map_category", "octet_mcat_map", ["mcat_category"])
    op.create_index("ix_octet_mcat_map_node", "octet_mcat_map", ["octet_node"])

    op.create_table(
        "mcat_chem_attempts",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("template_id", sa.String(length=80), nullable=False),
        sa.Column("seed", sa.BigInteger(), nullable=False),
        sa.Column("octet_node", sa.String(length=64), nullable=False),
        sa.Column("mcat_category", sa.String(length=8), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("misconception", sa.String(length=64), nullable=True),
        sa.Column("seconds", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("answered_at", sa.DateTime(timezone=True),
                  server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_mcat_chem_attempts_user_cat", "mcat_chem_attempts",
                    ["user_id", "mcat_category"])

    # Product rows: planning prices, adjustable in the table, no fake rows.
    op.execute(
        """
        INSERT INTO products (id, sku, exam_code, name, description, price_cents, currency, interval, access_days, active)
        VALUES
        (
          gen_random_uuid(), 'mcat_full', 'MCAT', 'MCAT Full Access',
          'MCAT question bank and analytics, plus generated-and-verified chemistry practice powered by the OCTET engine (every answer key machine-verified before serving). One-time purchase.',
          29900, 'usd', 'one_time', NULL, true
        ),
        (
          gen_random_uuid(), 'octet_chemistry', 'OCTET', 'OCTET Chemistry',
          'The full OCTET chemistry course: 312-node curriculum, generated practice with verified keys, unit exams, flashcards and analytics. One-time purchase.',
          9900, 'usd', 'one_time', NULL, true
        )
        ON CONFLICT (sku) DO NOTHING
        """
    )

    # The seed mapping. Categories per the AAMC content outline:
    #   4B gas phase; 4E atoms, nuclear decay, electronic structure and
    #   atomic chemical behavior (incl. stoichiometry and redox);
    #   5A water and its solutions (acid-base, solubility, titration);
    #   5B nature of molecules and intermolecular interactions;
    #   5D structure and function of biologically relevant molecules;
    #   5E chemical thermodynamics and kinetics.
    # 5C (separations and purifications) is deliberately UNSEEDED: OCTET has
    # no separations content to map, and padding the category would be the
    # dishonesty this table exists to prevent.
    rows = [
        # --- 4E: atoms, electronic structure, periodic behavior, stoichiometry, redox
        ("GEN1.MOLE", "The mole and Avogadro's number", "4E", "FC4", "Stoichiometry sits under FC4E in the AAMC outline."),
        ("GEN1.EMPIRICAL", "Empirical and molecular formulas", "4E", "FC4", "Formula determination is 4E stoichiometry."),
        ("GEN1.PERCENTCOMP", "Percent composition", "4E", "FC4", "Composition arithmetic is 4E stoichiometry."),
        ("GEN1.BALANCE", "Balancing chemical equations", "4E", "FC4", "Balanced equations are 4E stoichiometry."),
        ("GEN1.STOICH", "Reaction stoichiometry", "4E", "FC4", "Mole-ratio calculations are 4E stoichiometry."),
        ("GEN1.LIMITING", "Limiting reactant", "4E", "FC4", "Limiting-reagent problems are 4E stoichiometry."),
        ("GEN1.ELECTRONCONFIG", "Electron configurations", "4E", "FC4", "Electronic structure is the core of 4E."),
        ("GEN1.CONFIGEXCEPTIONS", "Exceptions and ion configurations", "4E", "FC4", "Electronic structure detail under 4E."),
        ("GEN1.QUANTUMMODEL", "The quantum mechanical model and orbitals", "4E", "FC4", "Quantum description of the atom under 4E."),
        ("GEN1.QUANTUMNUMBERS", "Quantum numbers and orbital shapes", "4E", "FC4", "Quantum numbers under 4E electronic structure."),
        ("GEN1.LIGHT", "Electromagnetic radiation and quantized energy", "4E", "FC4", "Quantized energy and atomic absorption/emission under 4E."),
        ("GEN1.SPECTRA", "Line spectra and the Bohr model", "4E", "FC4", "Atomic emission spectra under 4E."),
        ("GEN1.RADIUS", "Periodic trend: atomic and ionic radius", "4E", "FC4", "Periodic trends under 4E."),
        ("GEN1.IONIZATION", "Periodic trend: ionization energy and electron affinity", "4E", "FC4", "Periodic trends under 4E."),
        ("GEN1.ELECTRONEG", "Electronegativity and metallic character", "4E", "FC4", "Periodic trends under 4E."),
        ("GEN2.NUCLEARSTABILITY", "Nuclear structure and stability", "4E", "FC4", "Nuclear decay and stability under 4E."),
        ("GEN2.HALFLIFE", "Half life", "4E", "FC4", "Radioactive half-life under 4E nuclear decay."),
        ("GEN2.GALVANIC", "Galvanic cells and cell notation", "4E", "FC4", "Redox and electrochemistry are listed under FC4E; could also be argued adjacent to 5E energetics."),
        ("GEN2.NERNST", "The Nernst equation and concentration cells", "4E", "FC4", "Electrochemistry under 4E; the concentration dependence overlaps 5E thermodynamics."),
        # --- 4B: gas phase
        ("GEN1.IDEALGAS", "The ideal gas law", "4B", "FC4", "Gas phase behavior is FC4B."),
        ("GEN1.SIMPLEGASLAWS", "The simple gas laws", "4B", "FC4", "Gas phase behavior is FC4B."),
        # --- 5A: water and its solutions
        ("GEN2.PH", "pH, pOH and the pH scale", "5A", "FC5", "Acid-base chemistry of aqueous solutions is 5A."),
        ("GEN2.BUFFER", "Buffer composition and action", "5A", "FC5", "Buffers are 5A solution chemistry."),
        ("GEN2.HENDERSON", "Henderson Hasselbalch and buffer capacity", "5A", "FC5", "Henderson-Hasselbalch under 5A."),
        ("GEN2.TITRATIONWEAK", "Weak acid strong base titration curves", "5A", "FC5", "Titration is named in 5A."),
        ("GEN2.KSP", "Ksp and molar solubility", "5A", "FC5", "Solubility equilibria are 5A."),
        ("GEN1.MOLARITY", "Molarity", "5A", "FC5", "Solution concentration under 5A ions in solution."),
        ("GEN1.DILUTION", "Dilution", "5A", "FC5", "Solution preparation under 5A."),
        ("ORG1.PKA", "Bronsted acidity, pKa and equilibrium direction", "5A", "FC5", "Acid strength and pKa reasoning under 5A; organic acidity factors also inform 5B structure arguments."),
        ("ORG1.ACIDITYFACTORS", "Structural factors controlling acidity", "5A", "FC5", "Structure-acidity reasoning; 5A acid-base with a 5B structural flavor, noted for review."),
        # --- 5B: nature of molecules and intermolecular interactions
        ("GEN1.LEWIS", "Lewis structures", "5B", "FC5", "Covalent bonding description under 5B."),
        ("GEN1.HYBRIDIZATION", "Hybridization", "5B", "FC5", "Bonding models under 5B."),
        ("GEN1.IMF", "Intermolecular forces", "5B", "FC5", "Intermolecular interactions are the name of 5B."),
        ("GEN1.IMFPROPERTIES", "Properties that follow from IMF", "5B", "FC5", "IMF-driven bulk properties under 5B."),
        ("GEN1.VAPORPRESSURE", "Vapor pressure and Clausius Clapeyron", "5B", "FC5", "Liquid-phase behavior from IMFs under 5B."),
        ("GEN1.PHASECHANGE", "Phase transitions and heating curves", "5B", "FC5", "Phase behavior from intermolecular forces under 5B."),
        ("GEN1.PHASEDIAGRAM", "Phase diagrams", "5B", "FC5", "Phase behavior under 5B."),
        ("GEN1.SOLIDTYPES", "Types of solids", "5B", "FC5", "Solid-state bonding under 5B."),
        ("GEN1.OSMOSIS", "Osmotic pressure and the van't Hoff factor", "5B", "FC5", "Colligative properties; AAMC lists them with solution/liquid behavior - flagged for SME placement between 5A and 5B."),
        ("ORG1.RS", "R and S configuration", "5B", "FC5", "Stereochemistry is named under 5B."),
        ("ORG1.ENANTIODIA", "Enantiomers, diastereomers and meso compounds", "5B", "FC5", "Stereoisomer relationships under 5B."),
        ("ORG1.ISOMERS", "Constitutional isomers and degrees of unsaturation", "5B", "FC5", "Isomerism under 5B molecular structure."),
        ("ORG1.FUNCTIONALGROUPS", "Functional group recognition", "5B", "FC5", "Functional group structure under 5B."),
        ("ORG1.CARBOCATION", "Carbocation structure and stability", "5B", "FC5", "Reactive intermediate structure under 5B; mechanism context overlaps 5E kinetics."),
        ("ORG1.NUCELEC", "Nucleophiles, electrophiles and Lewis acids", "5B", "FC5", "Electron-pair reactivity concepts under 5B."),
        ("ORG1.SN2", "The SN2 mechanism", "5B", "FC5", "Substitution mechanisms appear in the AAMC organic content; placed 5B for structure-reactivity, kinetic aspects overlap 5E."),
        ("ORG2.NUCADDITION", "Nucleophilic addition", "5B", "FC5", "Carbonyl reactivity under 5B/5D organic chemistry; placed 5B for mechanism-structure reasoning."),
        ("ORG2.ACYLSUB", "Nucleophilic acyl substitution mechanism", "5B", "FC5", "Acyl substitution mechanism; AAMC carboxylic-acid-derivative chemistry, placed 5B for review."),
        ("ORG2.CARBONYLSTRUCTURE", "Carbonyl structure and nomenclature", "5B", "FC5", "Carbonyl structure under 5B/5D; placed 5B."),
        ("ORG2.TAUTOMERISM", "Keto enol tautomerism", "5B", "FC5", "Tautomerism under organic structure, 5B."),
        ("ORG2.AMINEPROPS", "Amine nomenclature, structure and basicity", "5B", "FC5", "Amine structure and basicity; 5B with 5A acid-base overlap."),
        # --- 5D: biologically relevant molecules
        ("ORG2.AMINOACIDS", "Amino acids and isoelectric point", "5D", "FC5", "Amino acid chemistry and pI are named under 5D."),
        # --- 5E: thermodynamics and kinetics
        ("GEN1.ENERGYBASICS", "Energy, heat, work and temperature", "5E", "FC5", "Thermodynamic vocabulary under 5E."),
        ("GEN1.FIRSTLAW", "System, surroundings and the first law", "5E", "FC5", "First law under 5E."),
        ("GEN1.ENTHALPY", "Enthalpy of reaction", "5E", "FC5", "Reaction enthalpy under 5E."),
        ("GEN1.HESS", "Hess's law", "5E", "FC5", "Hess's law under 5E."),
        ("GEN1.FORMATION", "Standard enthalpies of formation", "5E", "FC5", "Formation enthalpies under 5E."),
        ("GEN1.CALORIMETRY", "Calorimetry", "5E", "FC5", "Calorimetry under 5E."),
        ("GEN1.HEATCAPACITY", "Heat capacity and specific heat", "5E", "FC5", "Heat capacity under 5E."),
        ("GEN1.BONDENTHALPY", "Bond enthalpies", "5E", "FC5", "Bond-energy estimates of reaction enthalpy under 5E."),
        ("GEN2.RATES", "Reaction rates and rate expressions", "5E", "FC5", "Kinetics under 5E."),
        ("GEN2.RATELAW", "Rate laws and reaction order", "5E", "FC5", "Rate laws under 5E."),
        ("GEN2.INTEGRATED", "Integrated rate laws", "5E", "FC5", "Integrated rate laws under 5E."),
        ("GEN2.ARRHENIUS", "The Arrhenius equation", "5E", "FC5", "Temperature dependence of rate under 5E."),
        ("GEN2.EQUILIBRIUM", "The equilibrium state", "5E", "FC5", "Chemical equilibrium under 5E."),
        ("GEN2.ICE", "ICE tables", "5E", "FC5", "Equilibrium calculation under 5E."),
        ("GEN2.GIBBS", "Gibbs free energy and spontaneity", "5E", "FC5", "Free energy and spontaneity under 5E."),
    ]
    conn = op.get_bind()
    stmt = sa.text(
        """
        INSERT INTO octet_mcat_map
          (octet_node, octet_node_title, mcat_category, foundational_concept, rationale)
        VALUES (:node, :title, :cat, :fc, :why)
        ON CONFLICT ON CONSTRAINT uq_octet_mcat_node_cat_version DO NOTHING
        """
    )
    for node, title, cat, fc, why in rows:
        conn.execute(stmt, {"node": node, "title": title, "cat": cat, "fc": fc, "why": why})


def downgrade() -> None:
    op.execute("DELETE FROM products WHERE sku IN ('mcat_full', 'octet_chemistry')")
    op.drop_index("ix_mcat_chem_attempts_user_cat", table_name="mcat_chem_attempts")
    op.drop_table("mcat_chem_attempts")
    op.drop_index("ix_octet_mcat_map_node", table_name="octet_mcat_map")
    op.drop_index("ix_octet_mcat_map_category", table_name="octet_mcat_map")
    op.drop_table("octet_mcat_map")
