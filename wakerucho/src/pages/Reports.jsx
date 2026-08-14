export default function Reports() {
  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Reports</h2>
        </div>
        <button type="button" className="action-button">Export</button>
      </div>

      <div className="report-card">
        <div>
          <span>Cashflow</span>
          <strong>+$8.4k</strong>
        </div>
        <div>
          <span>Spend rate</span>
          <strong>34%</strong>
        </div>
        <div>
          <span>Gross margin</span>
          <strong>68%</strong>
        </div>
        <div>
          <span>Retention</span>
          <strong>92%</strong>
        </div>
      </div>
    </div>
  )
}
