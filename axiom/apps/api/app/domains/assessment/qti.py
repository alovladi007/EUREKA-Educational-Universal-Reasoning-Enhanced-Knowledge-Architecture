"""QTI 3.0 import and export for AXIOM assessment items.

Pure functions with no database and no web framework dependencies. Only the
Python standard library (xml.etree.ElementTree) is used, so this module can be
imported and exercised in isolation.

The AXIOM item dict shape converted to and from QTI is:

    {
        "identifier": str,        # stable id/code for the item
        "kind": str,              # mcq_single, numeric, math_expression, equation
        "prompt": str,            # the question text
        "options": list[str] | None,  # choices for mcq_single, else None
        "correct": str,           # mcq_single: option INDEX as a string ("2");
                                  # others: the answer expression or number as text
        "explanation": str,       # may be empty
    }

QTI mapping used here:

- mcq_single maps to a choiceInteraction. Each option becomes a simpleChoice
  with identifier "choice-0", "choice-1", ... The responseDeclaration has
  cardinality single and baseType identifier; its correctResponse value is the
  correct choice identifier. On import the correct choice identifier is mapped
  back to the option index string.
- numeric, math_expression, and equation map to a textEntryInteraction with
  cardinality single and baseType string. The correctResponse value is the
  correct answer string.

The AXIOM kind is stored as an axiom-kind attribute on the assessmentItem so it
round-trips exactly (it can also be inferred from the interaction type, but the
stored attribute is authoritative). The explanation is carried in a qti-companion
element inside the itemBody so it round-trips without loss.
"""

from __future__ import annotations

import xml.etree.ElementTree as ET

QTI_NS = "http://www.imsglobal.org/xsd/imsqti_v3p0"

RESPONSE_IDENTIFIER = "RESPONSE"

MCQ_KIND = "mcq_single"
TEXT_KINDS = ("numeric", "math_expression", "equation")

# Choice identifiers look like "choice-<index>".
_CHOICE_PREFIX = "choice-"


def _q(tag: str) -> str:
    """Return a namespaced tag name in Clark notation."""
    return f"{{{QTI_NS}}}{tag}"


def _local(tag: str) -> str:
    """Return the local (namespace-stripped) name of a Clark-notation tag."""
    if tag.startswith("{"):
        return tag.split("}", 1)[1]
    return tag


def _choice_id(index: int) -> str:
    return f"{_CHOICE_PREFIX}{index}"


def _index_from_choice_id(choice_id: str) -> str:
    """Map a choice identifier back to its option index as a string."""
    if choice_id.startswith(_CHOICE_PREFIX):
        return choice_id[len(_CHOICE_PREFIX) :]
    return choice_id


def _build_assessment_item(item: dict) -> ET.Element:
    """Build an assessmentItem Element (namespaced) for one AXIOM item."""
    identifier = item["identifier"]
    kind = item["kind"]
    prompt = item.get("prompt", "")
    explanation = item.get("explanation", "")
    correct = item["correct"]

    root = ET.Element(_q("assessmentItem"))
    root.set("identifier", identifier)
    root.set("title", identifier)
    root.set("adaptive", "false")
    root.set("timeDependent", "false")
    # Store the AXIOM kind so it can be recovered exactly on import.
    root.set("axiom-kind", kind)

    if kind == MCQ_KIND:
        _build_mcq(root, item, correct)
    elif kind in TEXT_KINDS:
        _build_text_entry(root, correct)
    else:
        raise ValueError(f"unknown AXIOM kind: {kind!r}")

    body = ET.SubElement(root, _q("itemBody"))
    prompt_el = ET.SubElement(body, _q("p"))
    prompt_el.set("class", "axiom-prompt")
    prompt_el.text = prompt

    if kind == MCQ_KIND:
        _append_choice_interaction(body, item)
    else:
        _append_text_interaction(body)

    # Carry the explanation in a companion element so it round-trips exactly.
    companion = ET.SubElement(body, _q("qti-companion"))
    expl_el = ET.SubElement(companion, _q("explanation"))
    expl_el.text = explanation

    return root


def _build_mcq(root: ET.Element, item: dict, correct: str) -> None:
    options = item.get("options") or []
    if not options:
        raise ValueError("mcq_single item requires a non-empty options list")

    decl = ET.SubElement(root, _q("responseDeclaration"))
    decl.set("identifier", RESPONSE_IDENTIFIER)
    decl.set("cardinality", "single")
    decl.set("baseType", "identifier")

    correct_response = ET.SubElement(decl, _q("correctResponse"))
    value = ET.SubElement(correct_response, _q("value"))
    value.text = _choice_id(int(correct))


def _build_text_entry(root: ET.Element, correct: str) -> None:
    decl = ET.SubElement(root, _q("responseDeclaration"))
    decl.set("identifier", RESPONSE_IDENTIFIER)
    decl.set("cardinality", "single")
    decl.set("baseType", "string")

    correct_response = ET.SubElement(decl, _q("correctResponse"))
    value = ET.SubElement(correct_response, _q("value"))
    value.text = correct


def _append_choice_interaction(body: ET.Element, item: dict) -> None:
    options = item.get("options") or []
    interaction = ET.SubElement(body, _q("choiceInteraction"))
    interaction.set("responseIdentifier", RESPONSE_IDENTIFIER)
    interaction.set("maxChoices", "1")
    interaction.set("shuffle", "false")
    for index, text in enumerate(options):
        choice = ET.SubElement(interaction, _q("simpleChoice"))
        choice.set("identifier", _choice_id(index))
        choice.text = text


def _append_text_interaction(body: ET.Element) -> None:
    interaction = ET.SubElement(body, _q("textEntryInteraction"))
    interaction.set("responseIdentifier", RESPONSE_IDENTIFIER)


def _serialize(root: ET.Element) -> str:
    """Serialize an Element to a UTF-8 XML string with declaration."""
    ET.register_namespace("", QTI_NS)
    body = ET.tostring(root, encoding="unicode")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + body


def item_to_qti(item: dict) -> str:
    """Convert one AXIOM item dict to a QTI 3.0 assessmentItem XML string."""
    root = _build_assessment_item(item)
    return _serialize(root)


def _find_first(parent: ET.Element, local_name: str) -> ET.Element | None:
    for child in parent.iter():
        if _local(child.tag) == local_name:
            return child
    return None


def _text_of(el: ET.Element | None) -> str:
    if el is None or el.text is None:
        return ""
    return el.text


def _parse_assessment_item(root: ET.Element) -> dict:
    """Recover an AXIOM item dict from an assessmentItem Element."""
    identifier = root.get("identifier", "")

    kind = root.get("axiom-kind")
    if kind is None:
        kind = _infer_kind(root)

    prompt = ""
    explanation = ""
    for el in root.iter():
        name = _local(el.tag)
        if name == "p" and el.get("class") == "axiom-prompt":
            prompt = _text_of(el)
        elif name == "explanation":
            explanation = _text_of(el)

    if kind == MCQ_KIND:
        options, correct = _parse_mcq(root)
    else:
        options = None
        correct = _parse_text_correct(root)

    return {
        "identifier": identifier,
        "kind": kind,
        "prompt": prompt,
        "options": options,
        "correct": correct,
        "explanation": explanation,
    }


def _infer_kind(root: ET.Element) -> str:
    """Infer the AXIOM kind when no axiom-kind attribute is present."""
    if _find_first(root, "choiceInteraction") is not None:
        return MCQ_KIND
    # Default text-entry kinds to numeric; the stored attribute normally wins.
    return "numeric"


def _parse_mcq(root: ET.Element) -> tuple[list[str], str]:
    options: list[str] = []
    interaction = _find_first(root, "choiceInteraction")
    if interaction is not None:
        for child in interaction:
            if _local(child.tag) == "simpleChoice":
                options.append(_text_of(child))

    correct_id = ""
    decl = _find_first(root, "responseDeclaration")
    if decl is not None:
        value = _find_first(decl, "value")
        correct_id = _text_of(value)
    correct = _index_from_choice_id(correct_id)
    return options, correct


def _parse_text_correct(root: ET.Element) -> str:
    decl = _find_first(root, "responseDeclaration")
    if decl is None:
        return ""
    value = _find_first(decl, "value")
    return _text_of(value)


def qti_to_item(xml: str) -> dict:
    """Convert a QTI 3.0 assessmentItem XML string back to an AXIOM item dict."""
    root = ET.fromstring(xml)
    if _local(root.tag) != "assessmentItem":
        found = _find_first(root, "assessmentItem")
        if found is None:
            raise ValueError("no assessmentItem element found in XML")
        root = found
    return _parse_assessment_item(root)


def bank_to_qti(items: list[dict]) -> str:
    """Wrap multiple AXIOM items in a single qti-item-bank XML string."""
    root = ET.Element(_q("qti-item-bank"))
    for item in items:
        root.append(_build_assessment_item(item))
    return _serialize(root)


def qti_to_bank(xml: str) -> list[dict]:
    """Convert a qti-item-bank XML string back to a list of AXIOM item dicts."""
    root = ET.fromstring(xml)
    items: list[dict] = []
    for child in root:
        if _local(child.tag) == "assessmentItem":
            items.append(_parse_assessment_item(child))
    return items
