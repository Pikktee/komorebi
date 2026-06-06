"""Höfliche HTTP-Helfer für Live-Scraper: robots.txt-Prüfung + Rate-Limit.

``httpx`` wird bewusst erst beim Aufruf importiert, damit ``build.py`` auch ohne
installierte Scraping-Abhängigkeiten (nur Seed-Daten) lauffähig bleibt.
"""
from __future__ import annotations

import time
import urllib.parse
import urllib.robotparser

USER_AGENT = (
    "KomorebiBot/0.1 (privates, nicht-kommerzielles Projekt; "
    "kontakt: komorebi@example.org)"
)

_MIN_ABSTAND_S = 2.0
_letzter_request = {"t": 0.0}
_robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}


def darf_crawlen(url: str) -> bool:
    """Prüft robots.txt für ``url`` (Vetting-Regel Teil a). Bei Unklarheit: True."""
    teile = urllib.parse.urlsplit(url)
    basis = f"{teile.scheme}://{teile.netloc}"
    if basis not in _robots_cache:
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"{basis}/robots.txt")
        try:
            rp.read()
        except Exception:
            # robots.txt nicht lesbar -> konservativ erlauben, aber höflich bleiben
            rp = None  # type: ignore[assignment]
        _robots_cache[basis] = rp  # type: ignore[assignment]
    rp = _robots_cache[basis]
    if rp is None:
        return True
    return rp.can_fetch(USER_AGENT, url)


def hole(url: str, timeout: float = 20.0) -> str:
    """Lädt eine Seite höflich (Rate-Limit, robots.txt-Respekt). Wirft bei Fehlern."""
    if not darf_crawlen(url):
        raise PermissionError(f"robots.txt verbietet {url}")

    import httpx  # lazy

    abstand = time.monotonic() - _letzter_request["t"]
    if abstand < _MIN_ABSTAND_S:
        time.sleep(_MIN_ABSTAND_S - abstand)
    _letzter_request["t"] = time.monotonic()

    antwort = httpx.get(
        url,
        headers={"User-Agent": USER_AGENT, "Accept-Language": "de,en;q=0.8"},
        timeout=timeout,
        follow_redirects=True,
    )
    antwort.raise_for_status()
    return antwort.text
