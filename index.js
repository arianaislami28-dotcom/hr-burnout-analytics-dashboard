const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure Database connection (USE YOUR WORKING URL-ENCODED POOLER LINK HERE)
const pool = new Pool({
  connectionString: "postgresql://postgres.aaidnrecmwlxnbqrzxxg:White%2320%23cordd@aws-1-us-west-2.pooler.supabase.com:5432/postgres",
});

app.get('/api/burnout-summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id, e.name, e.team, e.role,
        COUNT(CASE WHEN s.is_after_hours = true THEN 1 END)::float / COUNT(s.id) * 100 as late_slack_percentage,
        AVG(j.cycle_time_days) as avg_jira_cycle_days,
        t.days_since_last_vacation
      FROM employees e
      LEFT JOIN slack_activity s ON e.id = s.employee_id
      LEFT JOIN jira_tickets j ON e.id = j.employee_id
      LEFT JOIN time_off t ON e.id = t.employee_id
      GROUP BY e.id, e.name, e.team, e.role, t.days_since_last_vacation;
    `;
    
    const dbResult = await pool.query(query);
    
    // Apply Predictive Burnout Score Algorithm
    const employeesWithScores = dbResult.rows.map(emp => {
      let slackScore = emp.late_slack_percentage * 0.4; 
      let jiraScore = Math.min((emp.avg_jira_cycle_days / 20) * 100, 100) * 0.3;
      let vacationScore = Math.min((emp.days_since_last_vacation / 180) * 100, 100) * 0.3;
      
      let totalBurnoutScore = Math.round(slackScore + jiraScore + vacationScore);
      
      return { ...emp, burnoutScore: totalBurnoutScore };
    });

    res.json(employeesWithScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
