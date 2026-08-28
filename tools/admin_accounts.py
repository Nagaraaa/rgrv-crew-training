#!/usr/bin/env python3
"""Lecteur local et non-modifiant des profils RGRV Crew Training."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def configure_console_encoding() -> None:
    """Keep accents readable in Windows terminals and redirected output."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass


ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env.admin.local"
PROFILE_COLUMNS = (
    "username,created_at,total_attempts,xp,level,ranked_points,"
    "ranked_matches,leaderboard_opt_in"
)


def load_local_env(path: Path) -> None:
    """Charge les valeurs absentes de l'environnement sans afficher leur contenu."""
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def format_date(value: str | None) -> str:
    if not value:
        return "—"
    try:
        date = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return date.astimezone().strftime("%d/%m/%Y %H:%M")
    except ValueError:
        return value


def table(rows: list[dict[str, Any]]) -> str:
    headers = ["Profil", "Créé le", "Essais", "XP", "Niv.", "Classé", "Points", "Visible"]
    data = [
        [
            str(row.get("username") or "—"),
            format_date(row.get("created_at")),
            str(row.get("total_attempts") or 0),
            str(row.get("xp") or 0),
            str(row.get("level") or 1),
            str(row.get("ranked_matches") or 0),
            str(row.get("ranked_points") or 0),
            "oui" if row.get("leaderboard_opt_in") else "non",
        ]
        for row in rows
    ]
    widths = [len(header) for header in headers]
    for line in data:
        for index, value in enumerate(line):
            widths[index] = max(widths[index], len(value))

    def render(line: list[str]) -> str:
        return " | ".join(value.ljust(widths[index]) for index, value in enumerate(line))

    separator = "-+-".join("-" * width for width in widths)
    return "\n".join([render(headers), separator, *(render(line) for line in data)])


def fetch_profiles(url: str, secret: str) -> list[dict[str, Any]]:
    query = urlencode({"select": PROFILE_COLUMNS, "order": "created_at.asc"})
    request = Request(
        f"{url.rstrip('/')}/rest/v1/crew_profiles?{query}",
        headers={"apikey": secret, "Authorization": f"Bearer {secret}", "Accept": "application/json"},
        method="GET",
    )
    try:
        with urlopen(request, timeout=15) as response:
            payload = json.load(response)
    except HTTPError as error:
        if error.code in (401, 403):
            raise RuntimeError("Accès refusé : vérifie la clé d'administration dans .env.admin.local.") from error
        raise RuntimeError(f"Supabase a répondu avec l'erreur HTTP {error.code}.") from error
    except URLError as error:
        raise RuntimeError("Connexion à Supabase impossible. Vérifie Internet et SUPABASE_URL.") from error
    if not isinstance(payload, list):
        raise RuntimeError("Réponse Supabase inattendue.")
    return payload


def main() -> int:
    configure_console_encoding()
    parser = argparse.ArgumentParser(description="Affiche les profils RGRV sans modifier la base.")
    parser.add_argument("--json", action="store_true", help="Affiche les données au format JSON.")
    args = parser.parse_args()

    load_local_env(ENV_FILE)
    url = os.getenv("SUPABASE_URL", "").strip()
    secret = os.getenv("SUPABASE_SECRET_KEY", "").strip()
    if not url or not secret:
        print(
            "Configuration manquante. Copie tools/.env.admin.example vers .env.admin.local, puis renseigne les deux valeurs.",
            file=sys.stderr,
        )
        return 2

    try:
        profiles = fetch_profiles(url, secret)
    except RuntimeError as error:
        print(f"Erreur : {error}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(profiles, ensure_ascii=False, indent=2))
        return 0
    print(f"RGRV Crew Training — {len(profiles)} compte(s)\n")
    print(table(profiles) if profiles else "Aucun compte créé.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
