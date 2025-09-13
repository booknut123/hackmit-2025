import sqlite3
from datetime import date

DB_PATH = "health_period.db"

# ---------------------------
# Add methods
# ---------------------------


def add_user(user_name: str):
    """Add a new user."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("INSERT INTO users (user_name) VALUES (?)", (user_name,))
    conn.commit()
    conn.close()


def add_period(user_id: int, start_date: str, end_date: str = None):
    """Add a new period for a user. Dates should be 'YYYY-MM-DD' strings."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO periods (user_id, start_date, end_date) VALUES (?, ?, ?)",
        (user_id, start_date, end_date),
    )
    conn.commit()
    conn.close()


def add_daily_log(
    user_id: int, log_date: str, day_rating: int = None, journal_entry: str = None
):
    """Add a daily log for a user."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO daily_logs (user_id, log_date, day_rating, journal_entry) VALUES (?, ?, ?, ?)",
        (user_id, log_date, day_rating, journal_entry),
    )
    conn.commit()
    conn.close()


def add_emotion(name: str):
    """Add a new emotion."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES (?)", (name,))
    conn.commit()
    conn.close()


def add_daily_log_emotion(log_id: int, emotion_id: int):
    """Link an emotion to a daily log."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (?, ?)",
        (log_id, emotion_id),
    )
    conn.commit()
    conn.close()
