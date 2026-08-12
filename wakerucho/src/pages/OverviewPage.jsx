export default function OverviewPage() {
  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Welcome back</h1>
        </div>
        <button type="button" className="action-button">Quick actions</button>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <label>Total revenue</label>
          <strong>$24,580</strong>
        </article>
        <article className="stat-card">
          <label>Active users</label>
          <strong>8,492</strong>
        </article>
        <article className="stat-card">
          <label>Conversion</label>
          <strong>4.8%</strong>
        </article>
      </div>
    </section>
  )
}
