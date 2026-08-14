export default function Freelancing() {
  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Clients</p>
          <h2>Freelancing</h2>
        </div>
        <button type="button" className="action-button">New client</button>
      </div>

      <div className="stats-grid">
        <article className="balance-card">
          <span className="balance-label">This month</span>
          <strong>$6,840</strong>
        </article>
        <article className="balance-card">
          <span className="balance-label">Open invoices</span>
          <strong>12</strong>
        </article>
      </div>
    </div>
  )
}
