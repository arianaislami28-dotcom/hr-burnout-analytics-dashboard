import psycopg2
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

# CONNECT TO SUPABASE (Replace with your actual Supabase URI string)
db_url = "postgresql://postgres.aaidnrecmwlxnbqrzxxg:White%2320%23cordd@aws-1-us-west-2.pooler.supabase.com:5432/postgres"
conn = psycopg2.connect(db_url)
cursor = conn.cursor()

# 1. Insert 10 Hypothetical Employees
teams = ['Engineering', 'Sales', 'Product']
roles = {'Engineering': 'Software Engineer', 'Sales': 'Account Executive', 'Product': 'Product Manager'}

for i in range(1, 11):
    team = random.choice(teams)
    role = roles[team]
    cursor.execute(
        "INSERT INTO employees (id, name, email, role, team) VALUES (%s, %s, %s, %s, %s)",
        (i, fake.name(), fake.email(), role, team)
    )

# 2. Insert Slack, Jira, and PTO Data
for emp_id in range(1, 11):
    # Determine if this employee is a "Burnout Case" (Employees 1, 2, and 3)
    is_burned_out = emp_id in [1, 2, 3]
    
    # Slack Activity (Generate 10 logs per employee)
    for _ in range(10):
        # Burned out employees work late at night
        is_after_hours = random.choice([True, True, False]) if is_burned_out else random.choice([False, False, True])
        cursor.execute(
            "INSERT INTO slack_activity (employee_id, timestamp, message_count, is_after_hours) VALUES (%s, %s, %s, %s)",
            (emp_id, datetime.now() - timedelta(days=random.randint(1, 30)), random.randint(10, 50), is_after_hours)
        )
        
    # Jira Tickets (Generate 5 tickets per employee)
    for t_idx in range(5):
        # Burned out employees take much longer to finish tickets (slowing down velocity)
        cycle_time = random.randint(10, 20) if is_burned_out else random.randint(2, 6)
        cursor.execute(
            "INSERT INTO jira_tickets (employee_id, ticket_key, cycle_time_days, resolved_at) VALUES (%s, %s, %s, %s)",
            (emp_id, f"PROJ-{random.randint(100,999)}", cycle_time, datetime.now().date() - timedelta(days=random.randint(1, 30)))
        )
        
    # Time Off (Days since last vacation)
    # Burned out employees haven't taken a vacation in a long time
    days_since_vacation = random.randint(120, 200) if is_burned_out else random.randint(10, 45)
    cursor.execute(
        "INSERT INTO time_off (employee_id, days_since_last_vacation) VALUES (%s, %s)",
        (emp_id, days_since_vacation)
    )

conn.commit()
cursor.close()
conn.close()
print("Hypothetical database populated successfully!")
