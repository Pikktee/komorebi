# Komorebi – einfache Befehle. Aufruf:  make <ziel>   (z. B.  make daten)
.DEFAULT_GOAL := hilfe
.PHONY: hilfe setup daten daten-schnell web start

hilfe:
	@echo ""
	@echo "  Komorebi – verfügbare Befehle:"
	@echo ""
	@echo "    make daten           Stellen neu einsammeln & filtern – IMMER mit LLM (Key nötig)"
	@echo "    make web             Web-App lokal starten   ->  http://localhost:5173"
	@echo "    make start           Daten neu befüllen UND danach die Web-App starten"
	@echo "    make daten-schnell   nur Seed-Daten (kein Netz, kein LLM) – nur zum Testen"
	@echo "    make setup           Abhängigkeiten installieren (einmalig)"
	@echo ""

setup:
	pip install -r pipeline/requirements.txt
	cd web && npm install

# Befüllen = IMMER mit LLM. Fehlt ein gültiger OPENROUTER_API_KEY, bricht der Lauf
# bewusst mit Fehler ab (statt unsaubere Stellen ins System zu lassen).
daten:
	cd pipeline && python3 build.py --live --llm

daten-schnell:
	cd pipeline && python3 build.py

web:
	cd web && npm run dev

start: daten web
