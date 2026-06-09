import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([
    { id: 1, name: "Alex Morgan", team: "Engineering", role: "Software Engineer", avg_jira_cycle_days: 15, days_since_last_vacation: 145, burnoutScore: 88 },
    { id: 2, name: "Jordan Smith", team: "Engineering", role: "Software Engineer", avg_jira_cycle_days: 18, days_since_last_vacation: 160, burnoutScore: 92 },
    { id: 3, name: "Taylor Reed", team: "Sales", role: "Account Executive", avg_jira_cycle_days: 14, days_since_last_vacation: 130, burnoutScore: 78 },
    { id: 4, name: "Chris Evans", team: "Product", role: "Product Manager", avg_jira_cycle_days: 4, days_since_last_vacation: 25, burnoutScore: 30 },
    { id: 5, name: "Jamie Lane", team: "Engineering", role: "Software Engineer", avg_jira_cycle_days: 3, days_since_last_vacation: 15, burnoutScore: 22 },
    { id: 6, name: "Morgan Drew", team: "Sales", role: "Account Executive", avg_jira_cycle_days: 5, days_since_last_vacation: 35, burnoutScore: 41 },
    { id: 7, name: "Pat Cumulative", team: "Product", role: "Product Manager", avg_jira_cycle_days: 4, days_since_last_vacation: 40, burnoutScore: 35 }
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/burnout-summary')
      .then(res => res.json())
      .then(fetchedData => {
        if (fetchedData && fetchedData.length > 0) setData(fetchedData);
      })
      .catch(err => console.log("Using backup dashboard data..."));
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#111827', marginBottom: '4px', fontSize: '28px' }}>Internal HR Burnout Analytics Dashboard</h1>
      <p style={{ color: '#4b5563', marginBottom: '30px', fontSize: '15px' }}>Predictive risk scores calculated via core employee operational metrics.</p>

      {/* CUSTOM INFOGRAPHIC BAR CHART VIEW */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '18px' }}>Burnout Risk Index by Employee</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map(emp => (
            <div key={emp.id} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ width: '150px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>{emp.name}</div>
              <div style={{ flexGrow: 1, backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${emp.burnoutScore}%`, 
                  backgroundColor: emp.burnoutScore >= 65 ? '#ef4444' : '#3b82f6', 
                  height: '100%', 
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
              <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: emp.burnoutScore >= 65 ? '#dc2626' : '#1d4ed8', marginLeft: '12px', fontSize: '14px' }}>
                {emp.burnoutScore}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONABLE ALERTS ROSTER */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', color: '#dc2626', fontSize: '18px', fontWeight: 'bold' }}>⚠️ Critical HR Intervention Alerts</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#4b5563' }}>
              <th style={{ padding: '12px' }}>Employee Name</th>
              <th>Department</th>
              <th>Jira Ticket Cycle</th>
              <th>Vacation Stagnation</th>
              <th style={{ textAlign: 'right' }}>Calculated Risk</th>
            </tr>
          </thead>
          <tbody>
            {data.filter(e => e.burnoutScore >= 65).map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fff5f5' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#111827' }}>{emp.name}</td>
                <td style={{ color: '#4b5563' }}>{emp.team}</td>
                <td style={{ color: '#4b5563' }}>{Math.round(emp.avg_jira_cycle_days)} Days/Ticket</td>
                <td style={{ color: '#4b5563' }}>{emp.days_since_last_vacation} Days Since PTO</td>
                <td style={{ color: '#dc2626', fontWeight: 'bold', textAlign: 'right', paddingRight: '12px' }}>{emp.burnoutScore}% Risk</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
