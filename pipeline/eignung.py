"""Eignungsprüfung Stufe 1 (deterministisch): trennt passende Freiwilligen-/Praktikums-/
Feldassistenz-Stellen von ungeeigneten Festanstellungen und Karrierejobs.

Zielnutzerin ist eine angehende Biologin/Umweltforscherin, die FÖJ-ähnliche Stellen sucht:
befristet, oft mit Taschengeld/Unterkunft, Einstieg ohne lange Berufserfahrung.
**Nicht** gewollt sind feste, bezahlte Karrierestellen (Manager, Direktorin, Professur …).

Ergebnis je Datensatz:
- ``"geeignet"``   – klar passend (übernehmen)
- ``"ungeeignet"`` – klar Festanstellung/Karriere (verwerfen)
- ``"unklar"``     – nicht eindeutig -> Stufe 2 (LLM) entscheidet, sonst behalten

Die Funktion ist rein deterministisch (keine Netz-/LLM-Aufrufe) und damit voll testbar.
"""
from __future__ import annotations

# --- Job-Typen (z. B. von Conservation Job Board) ----------------------------------
_JOBTYP_GEEIGNET = {
    "temporary", "seasonal", "internship", "paid-internship", "unpaid-internship",
    "volunteer", "fellowship", "americorps", "student", "traineeship", "trainee",
    "apprenticeship", "contract-seasonal",
}
_JOBTYP_UNGEEIGNET = {
    "permanent", "faculty-postdoc", "faculty", "postdoc", "tenure", "tenure-track",
    "full-time-permanent", "career",
}

# --- Signalwörter im Titel ----------------------------------------------------------
_TITEL_GEEIGNET = (
    "intern", "internship", "volunteer", "freiwillig", "seasonal", "field assistant",
    "field technician", "field tech", "field crew", "research assistant",
    "research technician", "trainee", "fellow", "fellowship", "conservation corps",
    "americorps", "praktik", "feldassistenz", "feldforschung", "field course",
    "summer", "reu", "work camp", "workcamp", "wwoof", "esc ", "förderjahr",
)
# „Harte" Negativ-Titel: klare Karriere-/Leitungsrollen. Diese verwerfen IMMER –
# auch wenn der job_type positiv aussieht (z. B. befristete Leitungsstelle).
_TITEL_HART_UNGEEIGNET = (
    "manager", "director", "vice president", "president", "chief", "head of",
    "superintendent", "supervisor", "principal", "professor", "lecturer",
    "leadership", "executive", " ceo", "cfo", "coo", "dean", "faculty", "tenure",
    "endowed", "provost", "secretary", "officer iii", "officer iv",
    "graduate research assistantship", "graduate assistantship", "graduate certificate",
    "certificate online", "online certificate", "degree program", "phd", "ph.d",
    "m.s. graduate", "ms research assistant", "graduate position",
)
# „Weiche" Negativ-Titel: verwerfen nur, wenn KEIN positives Signal vorliegt.
_TITEL_WEICH_UNGEEIGNET = (
    "senior ", "sr.", "administrator", "coordinator", "specialist",
    "biologist ii", "biologist iii", "ecologist iii", "project officer",
)

# Erfahrungsstufen, die auf gestandene Profis zielen
_ERFAHRUNG_UNGEEIGNET = {"high-level", "senior", "executive", "director"}


def _enthaelt(text: str, nadeln) -> bool:
    t = (text or "").lower()
    return any(n in t for n in nadeln)


def bewerten(raw: dict) -> tuple[str, str]:
    """Bewertet einen Roh-Datensatz. Gibt ``(status, begruendung)`` zurück."""
    # Kuratierte Quellen (Seed) sind per Definition geprüft und passend.
    if raw.get("_kuratiert") or raw.get("quelle") == "seed":
        return ("geeignet", "kuratiert")

    titel = raw.get("titel") or ""
    jobtyp = (raw.get("_job_type") or "").strip().lower()
    erfahrung = (raw.get("_experience") or "").strip().lower()

    # 1) Harte Ausschlüsse (überschreiben auch positive job_type-Signale)
    if (
        jobtyp in _JOBTYP_UNGEEIGNET
        or erfahrung in _ERFAHRUNG_UNGEEIGNET
        or _enthaelt(titel, _TITEL_HART_UNGEEIGNET)
    ):
        return ("ungeeignet", "festanstellung/karriere")

    # 2) Positive Signale
    if jobtyp in _JOBTYP_GEEIGNET or _enthaelt(titel, _TITEL_GEEIGNET):
        return ("geeignet", f"positiv (jobtyp={jobtyp or '-'})")

    # 3) Weiche Ausschlüsse (nur ohne positives Signal)
    if _enthaelt(titel, _TITEL_WEICH_UNGEEIGNET):
        return ("ungeeignet", "vermutlich Profi-/Leitungsstelle")

    return ("unklar", "kein eindeutiges Signal")
