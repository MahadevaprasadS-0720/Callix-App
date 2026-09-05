import sys
from pathlib import Path

# Add backend directory to sys.path so modules resolve cleanly
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir.parent))

from python.app import app
from python.config import settings

if __name__ == "__main__":
    print(f"============================================================")
    print(f" Starting {settings.PROJECT_NAME} (v{settings.PROJECT_VERSION})")
    print(f" Listening on http://{settings.HOST}:{settings.PORT}")
    print(f" Database: {settings.DATABASE_URL}")
    print(f" Machine Learning: Random Forest, SVM, 1D-CNN, RNN, LSTM")
    print(f" NLP: Active | STT: Active | Reports: Active")
    print(f"============================================================")
    app.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
