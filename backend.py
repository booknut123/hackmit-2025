from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import date


DB_PATH = "health_period.db"

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)


class JournalEntry(BaseModel):
    log_date: date
    day_rating: Optional[int] = None
    journal_entry: Optional[str] = None
    emotions: List[str] = []


def insert_journal(entry: JournalEntry):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Insert into daily_logs
    cur.execute(
        """INSERT OR REPLACE INTO daily_logs (log_date, day_rating, journal_entry)
           VALUES (?, ?, ?)""",
        (entry.log_date, entry.day_rating, entry.journal_entry),
    )
    conn.commit()

    # Get the log_id
    cur.execute("SELECT log_id FROM daily_logs WHERE log_date = ?", (entry.log_date,))
    log_id = cur.fetchone()[0]

    # Insert emotions
    for emotion in entry.emotions:
        # Add emotion if doesn't exist
        cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES (?)", (emotion,))
        conn.commit()
        cur.execute("SELECT emotion_id FROM emotions WHERE name = ?", (emotion,))
        emotion_id = cur.fetchone()[0]

        # Link emotion to log
        cur.execute(
            "INSERT OR IGNORE INTO daily_log_emotions (log_id, emotion_id) VALUES (?, ?)",
            (log_id, emotion_id),
        )
        conn.commit()

    conn.close()


@app.post("/submit")
def submit_journal(entry: JournalEntry):
    insert_journal(entry)
    return {"status": "success"}
