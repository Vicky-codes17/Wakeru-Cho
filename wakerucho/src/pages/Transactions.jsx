export default function Transactions() {
  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Finance</p>
          <h2>Transactions</h2>
        </div>
        <button type="button" className="action-button">New payment</button>
      </div>

      <div className="list-card">
        {[
          ['Stripe payout', '$2,480', 'Completed'],
          ['Design retainer', '$1,050', 'Pending'],
          ['Hosting invoice', '$128', 'Paid'],
        ].map(([title, amount, status]) => (
          <div className="list-row" key={title}>
            <div>
              <strong>{title}</strong>
              <span>{status}</span>
            </div>
            <strong>{amount}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
