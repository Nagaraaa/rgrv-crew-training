#!/usr/bin/env python3
"""Lecteur local et non-modifiant des profils RGRV Crew Training."""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
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


class Color:
    """Small ANSI palette with a no-colour fallback for redirected output."""

    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    YELLOW = "\033[38;5;220m"
    GREEN = "\033[38;5;114m"
    CYAN = "\033[38;5;117m"
    RED = "\033[38;5;203m"
    WHITE = "\033[38;5;255m"


def use_color(disabled: bool) -> bool:
    if disabled or os.getenv("NO_COLOR") or not sys.stdout.isatty():
        return False
    if os.name != "nt":
        return True
    try:
        import ctypes

        kernel32 = ctypes.windll.kernel32
        handle = kernel32.GetStdHandle(-11)  # STD_OUTPUT_HANDLE
        mode = ctypes.c_uint()
        if not kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
            return False
        return bool(kernel32.SetConsoleMode(handle, mode.value | 0x0004))  # ENABLE_VIRTUAL_TERMINAL_PROCESSING
    except (AttributeError, OSError):
        return False


def paint(value: str, color: str, enabled: bool, *, bold: bool = False) -> str:
    if not enabled:
        return value
    weight = Color.BOLD if bold else ""
    return f"{weight}{color}{value}{Color.RESET}"


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


def table(rows: list[dict[str, Any]], colors: bool) -> str:
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

    def render(line: list[str], *, header: bool = False) -> str:
        return " | ".join(value.ljust(widths[index]) for index, value in enumerate(line))

    separator = "-+-".join("-" * width for width in widths)
    rendered = [paint(render(headers, header=True), Color.YELLOW, colors, bold=True), separator]
    rendered.extend(render(line) for line in data)
    return "\n".join(rendered)


def profile_stats(rows: list[dict[str, Any]]) -> dict[str, str | int]:
    """Calculate local display-only statistics from the fetched response."""
    today = datetime.now().date()
    created_today = 0
    for row in rows:
        created_at = row.get("created_at")
        if not created_at:
            continue
        try:
            if datetime.fromisoformat(str(created_at).replace("Z", "+00:00")).astimezone().date() == today:
                created_today += 1
        except ValueError:
            continue

    count = len(rows)
    total_xp = sum(int(row.get("xp") or 0) for row in rows)
    total_attempts = sum(int(row.get("total_attempts") or 0) for row in rows)
    ranked_members = sum(1 for row in rows if row.get("leaderboard_opt_in"))
    ranked_points = sum(int(row.get("ranked_points") or 0) for row in rows)
    return {
        "count": count,
        "today": created_today,
        "xp": total_xp,
        "xp_average": round(total_xp / count) if count else 0,
        "attempts": total_attempts,
        "ranked_members": ranked_members,
        "ranked_points": ranked_points,
    }


def clear_console(colors: bool) -> None:
    if colors:
        print("\033[2J\033[H", end="")
    else:
        print("\n" * 3)


def render_dashboard(rows: list[dict[str, Any]], colors: bool, *, auto_refresh: float | None) -> None:
    clear_console(colors)
    stats = profile_stats(rows)
    now = datetime.now().strftime("%d/%m/%Y à %H:%M:%S")
    print(paint("RGRV  ·  VISUALISEUR DES COMPTES", Color.YELLOW, colors, bold=True))
    print(paint("Lecture seule · Supabase", Color.DIM, colors))
    print()
    print(
        f"{paint(str(stats['count']), Color.WHITE, colors, bold=True)} compte(s)"
        f"  {paint('·', Color.DIM, colors)}  "
        f"{paint(str(stats['today']), Color.GREEN, colors, bold=True)} créé(s) aujourd’hui"
        f"  {paint('·', Color.DIM, colors)}  "
        f"{paint(str(stats['xp']), Color.CYAN, colors, bold=True)} XP cumulée"
        f"  {paint('·', Color.DIM, colors)}  "
        f"{paint(str(stats['attempts']), Color.CYAN, colors, bold=True)} essai(s)"
    )
    print(
        f"Classement : {stats['ranked_members']} visible(s)"
        f" · {stats['ranked_points']} point(s)"
        f" · XP moyenne {stats['xp_average']}"
    )
    print(paint(f"Dernière lecture : {now}", Color.DIM, colors))
    print()
    print(table(rows, colors) if rows else paint("Aucun compte créé pour le moment.", Color.DIM, colors))
    print()
    if auto_refresh:
        print(
            paint(f"Actualisation automatique toutes les {auto_refresh:g} secondes.", Color.GREEN, colors)
            + "  R = maintenant · A = désactiver · Q = quitter"
        )
    else:
        print("Entrée/R = actualiser · A = auto (30 s) · I = définir l’intervalle · Q = quitter")


def read_auto_command(seconds: float, colors: bool) -> str:
    """Wait for a Windows keypress while keeping the automatic refresh responsive."""
    try:
        import msvcrt
    except ImportError:
        time.sleep(seconds)
        return "r"

    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        remaining = max(0, int(deadline - time.monotonic()) + 1)
        suffix = paint(f"  Prochaine lecture dans {remaining:02d}s", Color.DIM, colors)
        print(suffix, end="\r", flush=True)
        if msvcrt.kbhit():
            return msvcrt.getwch().strip().lower()
        time.sleep(0.15)
    print(" " * 70, end="\r")
    return "r"


def interactive_dashboard(url: str, secret: str, colors: bool, initial_interval: float | None) -> int:
    """Keep one console session open and only perform GET requests."""
    interval = initial_interval
    while True:
        try:
            profiles = fetch_profiles(url, secret)
            render_dashboard(profiles, colors, auto_refresh=interval)
        except RuntimeError as error:
            print(paint(f"Erreur : {error}", Color.RED, colors, bold=True))
            print("R = réessayer · Q = quitter")

        if interval:
            command = read_auto_command(interval, colors)
        else:
            try:
                command = input("> ").strip().lower()
            except (EOFError, KeyboardInterrupt):
                print()
                return 0

        if command in {"q", "quit", "exit"}:
            return 0
        if command in {"", "r", "refresh"}:
            continue
        if command in {"a", "auto"}:
            interval = None if interval else 30.0
            continue
        if command in {"i", "interval"}:
            try:
                raw_interval = input("Intervalle en secondes (5 minimum, vide = annuler) : ").strip()
                if not raw_interval:
                    continue
                interval = max(5.0, float(raw_interval.replace(",", ".")))
            except ValueError:
                print(paint("Intervalle invalide : conserve la valeur actuelle.", Color.RED, colors))
                time.sleep(1.5)
            continue

        print(paint("Commande inconnue. Utilise R, A, I ou Q.", Color.RED, colors))
        time.sleep(1.2)


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
    parser.add_argument(
        "--watch",
        nargs="?",
        type=float,
        const=30.0,
        metavar="SECONDES",
        help="Actualise automatiquement (30 secondes par défaut).",
    )
    parser.add_argument("--once", action="store_true", help="Affiche une seule lecture, sans console interactive.")
    parser.add_argument("--no-color", action="store_true", help="Désactive les couleurs ANSI.")
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

    if args.json:
        try:
            profiles = fetch_profiles(url, secret)
        except RuntimeError as error:
            print(f"Erreur : {error}", file=sys.stderr)
            return 1
        print(json.dumps(profiles, ensure_ascii=False, indent=2))
        return 0

    colors = use_color(args.no_color)
    if args.once or not sys.stdin.isatty():
        try:
            profiles = fetch_profiles(url, secret)
        except RuntimeError as error:
            print(f"Erreur : {error}", file=sys.stderr)
            return 1
        render_dashboard(profiles, colors, auto_refresh=None)
        return 0

    return interactive_dashboard(url, secret, colors, args.watch)


if __name__ == "__main__":
    raise SystemExit(main())
