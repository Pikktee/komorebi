#!/bin/bash
# Release-Automatisierung für Komorebi.
#
# Bumping der Version in web/package.json, Erstellen eines Git-Tags
# und Puchen an GitHub, was das automatische Deployment auslöst.
set -e

# Sicherstellen, dass wir im Projekt-Root sind
cd "$(dirname "$0")/.."

# 1. Branch prüfen
BRANCH=$(git symbolic-ref --short -q HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Fehler: Releases dürfen nur auf dem 'main'-Branch erstellt werden."
  echo "   Aktueller Branch: $BRANCH"
  exit 1
fi

# 2. Git Status prüfen (sauberer Arbeitsbaum erforderlich)
if ! git diff-index --quiet HEAD --; then
  echo "❌ Fehler: Dein Git-Arbeitsverzeichnis ist nicht sauber."
  echo "   Bitte committe oder stashe deine Änderungen, bevor du ein Release erstellst."
  git status -s
  exit 1
fi

# 3. Neueste Commits abrufen
echo "🔄 Aktualisiere lokalen Stand von GitHub..."
git pull origin main

# 4. Auswahl des Release-Typs
echo ""
echo "============================================="
echo "       Komorebi – Neues Release erstellen"
echo "============================================="
echo ""
echo "Welche Version möchtest du veröffentlichen?"
echo "  1) Bugfix / Patch     (z.B. 1.0.0 -> 1.0.1) - Rückwärtskompatible Fehlerbehebungen"
echo "  2) Minor / Feature    (z.B. 1.0.0 -> 1.1.0) - Neue rückwärtskompatible Funktionen"
echo "  3) Major / Breaking   (z.B. 1.0.0 -> 2.0.0) - Inkompatible Änderungen"
echo ""
read -p "Deine Auswahl (1-3): " WAHL

case $WAHL in
  1)
    TYPE="patch"
    ;;
  2)
    TYPE="minor"
    ;;
  3)
    TYPE="major"
    ;;
  *)
    echo "❌ Fehler: Ungültige Auswahl."
    exit 1
    ;;
esac

# 5. Bestätigung
echo ""
echo "Die Version wird um ein '$TYPE'-Level erhöht."
read -p "Möchtest du fortfahren? (ja/nein): " BESTAETIGUNG

if [ "$BESTAETIGUNG" != "ja" ] && [ "$BESTAETIGUNG" != "j" ] && [ "$BESTAETIGUNG" != "yes" ]; then
  echo "Operation abgebrochen."
  exit 0
fi

# 6. Version bumpen & taggen in web/
echo ""
echo "🚀 Erhöhe Version in 'web/'..."
cd web
# Version bumpen ohne automatische Git-Aktionen von npm
NEW_VERSION=$(npm version $TYPE --no-git-tag-version)
cd ..

# Git commit und tag manuell erstellen
git add web/package.json web/package-lock.json
git commit -m "release: $NEW_VERSION"
git tag -a "$NEW_VERSION" -m "release: $NEW_VERSION"

# 7. Push zu GitHub
echo ""
echo "📤 Pushe Version $NEW_VERSION und Git-Tags zu GitHub..."
git push origin main
git push origin --tags

echo ""
echo "🎉 Release $NEW_VERSION wurde erfolgreich veröffentlicht!"
echo "   GitHub Actions startet jetzt den Build und das automatische Deployment auf:"
echo "   • GitHub Pages (https://pikktee.github.io/komorebi/)"
echo "   • Railway (https://frontend-production-5363.up.railway.app)"
echo ""
