import sqlite3

DB_PATH = "health_period.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """CREATE TABLE IF NOT EXISTS periods (
            period_id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_date DATE NOT NULL,
            end_date DATE
    );"""
    )

    cur.execute(
        """CREATE TABLE IF NOT EXISTS daily_logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_date DATE NOT NULL,
            day_rating INTEGER CHECK (day_rating BETWEEN 1 AND 10),
            journal_entry TEXT,
            UNIQUE(log_date)
    );"""
    )

    cur.execute(
        """CREATE TABLE IF NOT EXISTS emotions (
            emotion_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
    );"""
    )

    cur.execute(
        """CREATE TABLE IF NOT EXISTS daily_log_emotions (
            log_id INTEGER NOT NULL,
            emotion_id INTEGER NOT NULL,
            PRIMARY KEY (log_id, emotion_id),
            FOREIGN KEY (log_id) REFERENCES daily_logs(log_id) ON DELETE CASCADE,
            FOREIGN KEY (emotion_id) REFERENCES emotions(emotion_id) ON DELETE CASCADE
    );"""
    )

    conn.commit()
    conn.close()


def clear_db():
    """
    Resets database and removes all entries.
    """
    conn = sqlite3.connect("health_period.db")
    cur = conn.cursor()
    
    cur.execute("DROP TABLE IF EXISTS periods")
    cur.execute("DROP TABLE IF EXISTS daily_logs")
    cur.execute("DROP TABLE IF EXISTS emotions")
    cur.execute("DROP TABLE IF EXISTS daily_log_emotions")

    conn.commit()
    conn.close()

    init_db()


def add_fake_init_data():
    # === POPULATING DATA === #
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # ---------------------------
    # Insert fake periods
    # ---------------------------
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-01-05', '2025-01-10');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-02-12', '2025-02-16');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-03-08', '2025-03-13');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-04-20', '2025-04-25');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-05-15', '2025-05-20');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-06-01', '2025-06-05');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-06-18', '2025-06-23');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-07-10', '2025-07-15');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-08-05', '2025-08-10');"
    )
    cur.execute(
        "INSERT INTO periods (start_date, end_date) VALUES ('2025-09-01', '2025-09-06');"
    )

    # ---------------------------
    # Insert fake emotions
    # ---------------------------
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Happy');")
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Sad');")
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Anxious');")
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Excited');")
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Tired');")
    cur.execute("INSERT OR IGNORE INTO emotions (name) VALUES ('Stressed');")

    # ---------------------------
    # Insert fake daily_logs
    # ---------------------------
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-01', 7, 'Felt good today');"
    )
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-02', 6, 'A bit tired');"
    )
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-03', 4, 'Stressful day');"
    )
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-04', 9, 'Excited for the weekend');"
    )
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-05', 5, 'Average day');"
    )
    cur.execute(
        "INSERT INTO daily_logs (log_date, day_rating, journal_entry) VALUES ('2025-09-06', 8, 'Very productive');"
    )

    # ---------------------------
    # Insert fake daily_log_emotions
    # ---------------------------
    # Map log_id to emotions (assuming auto-increment IDs start at 1)
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (1, 1);"
    )  # Happy
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (1, 5);"
    )  # Tired
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (2, 5);"
    )  # Tired
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (3, 6);"
    )  # Stressed
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (4, 1);"
    )  # Happy
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (4, 4);"
    )  # Excited
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (5, 2);"
    )  # Sad
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (6, 3);"
    )  # Anxious
    cur.execute(
        "INSERT INTO daily_log_emotions (log_id, emotion_id) VALUES (6, 1);"
    )  # Happy

    conn.commit()
    conn.close()

clear_db()
add_fake_init_data()
