const stats = [
  { label: 'Income', value: '$27,459', detail: '+12.4%' },
  { label: 'Expenses', value: '$12,160', detail: '-3.1%' },
  { label: 'Net', value: '$15,299', detail: '+8.7%' },
]

const transfers = [
  { name: 'Figma', amount: '$640', detail: 'Design tools' },
  { name: 'Shopify', amount: '$1,280', detail: 'Ecommerce' },
  { name: 'Notion', amount: '$240', detail: 'Productivity' },
]

export default function Home() {
  return (
    <div className="page-section">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Good morning, Alex</h1>
        </div>
        <button type="button" className="action-button">
          Add transaction
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <label>{stat.label}</label>
            <strong>{stat.value}</strong>
            <div>{stat.detail}</div>
          </article>
        ))}
      </div>

      <div className="stats-grid">
        <article className="list-card">
          <div className="section-header">
            <h2>Recent activity</h2>
          </div>
          {transfers.map((item) => (
            <div className="list-row" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.detail}</span>
              </div>
              <strong>{item.amount}</strong>
            </div>
          ))}
        </article>

        <article className="balance-card">
          <div className="section-header">
            <h2>Balance</h2>
          </div>
          <span className="balance-label">Available</span>
          <strong>$18,240</strong>
          <div className="report-card">
            <div>
              <span>Income</span>
              <strong>78%</strong>
            </div>
            <div>
              <span>Expenses</span>
              <strong>22%</strong>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
