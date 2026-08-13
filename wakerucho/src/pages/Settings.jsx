export default function Settings() {
  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="list-card">
        {[
          ['Account', 'Personal details'],
          ['Security', 'Two-factor enabled'],
          ['Notifications', 'Daily summary'],
          ['Billing', 'No active plan'],
        ].map(([label, value]) => (
          <div className="list-row" key={label}>
            <div>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
            <span>Manage</span>
          </div>
        ))}
      </div>
    </div>
  )
}
