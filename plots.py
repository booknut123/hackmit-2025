import sqlite3
import pandas as pd
import matplotlib.pyplot as plt

DB_PATH = "health_period.db"

def get_user_daily_logs(user_id: int):
    """Return daily logs for a user as a DataFrame."""
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query(
        "SELECT log_date, day_rating, journal_entry FROM daily_logs WHERE user_id = ? ORDER BY log_date",
        conn,
        params=(user_id,),
    )
    conn.close()
    df["log_date"] = pd.to_datetime(df["log_date"])
    return df


def get_user_periods(user_id: int):
    """Return periods for a user as a DataFrame."""
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query(
        "SELECT start_date, end_date FROM periods WHERE user_id = ? ORDER BY start_date",
        conn,
        params=(user_id,),
    )
    conn.close()
    df["start_date"] = pd.to_datetime(df["start_date"])
    df["end_date"] = pd.to_datetime(df["end_date"])
    return df


# ---------------------------
# Plot: mood over time
# ---------------------------


def plot_weekly_mood_trends(user_id: int):
    df = get_user_daily_logs(user_id)
    if df.empty:
        print("No logs for this user.")
        return

    # Resample weekly
    weekly = df.set_index("log_date")["day_rating"].resample("W").mean()

    plt.figure(figsize=(10, 4))
    plt.plot(weekly.index, weekly.values, marker="o")
    plt.title("Weekly Mood Trend")
    plt.xlabel("Week")
    plt.ylabel("Average Mood")
    plt.grid(True)
    plt.show()


# ---------------------------
# Plot: mood by cycle phase
# ---------------------------


def plot_mood_by_cycle_phase(user_id: int):
    logs = get_user_daily_logs(user_id)
    periods = get_user_periods(user_id)

    if logs.empty or periods.empty:
        print("Insufficient data for this plot.")
        return

    # Assign cycle phase: 'Menstrual', 'Follicular', 'Ovulatory', 'Luteal'
    # Simplified approach: 28-day cycle assumption
    def get_phase(log_date):
        for _, period in periods.iterrows():
            start, end = period["start_date"], period["end_date"]
            if pd.isna(end):
                end = start
            if start <= log_date <= end:
                return "Menstrual"
        # Otherwise assign based on last period start
        last_start = periods[periods["start_date"] <= log_date]["start_date"].max()
        if pd.isna(last_start):
            return "Unknown"
        day_in_cycle = (log_date - last_start).days % 28
        if day_in_cycle < 7:
            return "Follicular"
        elif day_in_cycle < 14:
            return "Ovulatory"
        else:
            return "Luteal"

    logs["phase"] = logs["log_date"].apply(get_phase)
    phase_avg = logs.groupby("phase")["day_rating"].mean()

    plt.figure(figsize=(6, 4))
    phase_avg = phase_avg.reindex(["Menstrual", "Follicular", "Ovulatory", "Luteal"])
    phase_avg.plot(kind="bar", color="skyblue")
    plt.title("Average Mood by Cycle Phase")
    plt.ylabel("Mood Rating")
    plt.xlabel("Cycle Phase")
    plt.ylim(0, 10)
    plt.show()


# ---------------------------
# Compute factors: sleep, exercise, stress, nutrition
# ---------------------------


def compute_user_factors(user_id: int):
    df = get_user_daily_logs(user_id)
    if df.empty:
        print("No logs for this user.")
        return

    # Assume journal_entry contains keywords: "sleep:8 exercise:1 stress:3 nutrition:4"
    factors = ["sleep", "exercise", "stress", "nutrition"]

    # Extract numbers from journal_entry
    for f in factors:
        df[f] = df["journal_entry"].str.extract(f"{f}:(\d+)").astype(float)

    avg_factors = df[factors].mean()
    print("Average Factors per User:")
    print(avg_factors)

    # Plot
    avg_factors.plot(kind="bar", color="lightgreen", figsize=(6, 4))
    plt.title("Average Daily Factors")
    plt.ylabel("Average Rating")
    plt.ylim(0, 10)
    plt.show()


# ---------------------------
# Period metrics: length and frequency
# ---------------------------


def compute_period_metrics(user_id: int):
    df = get_user_periods(user_id)
    if df.empty:
        print("No period data for this user.")
        return

    # Length
    df["length"] = (df["end_date"] - df["start_date"]).dt.days + 1
    avg_length = df["length"].mean()

    # Frequency (days between starts)
    df = df.sort_values("start_date")
    df["freq"] = df["start_date"].diff().dt.days
    avg_freq = df["freq"].mean()

    print(f"Average Period Length: {avg_length:.1f} days")
    print(f"Average Cycle Frequency: {avg_freq:.1f} days")
