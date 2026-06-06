import sys
from pathlib import Path

# Pipeline-Verzeichnis importierbar machen (für `import dedup`, `from sources import ...`)
sys.path.insert(0, str(Path(__file__).resolve().parent))
