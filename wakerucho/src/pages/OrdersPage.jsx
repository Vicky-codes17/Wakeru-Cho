export default function OrdersPage() {
  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Orders</p>
          <h2>Recent orders</h2>
        </div>
      </div>

      <div className="list-card">
        <div className="list-row">
          <div>
            <strong>#1042</strong>
            <span>Premium plan</span>
          </div>
          <span>$320</span>
        </div>
        <div className="list-row">
          <div>
            <strong>#1041</strong>
            <span>Starter pack</span>
          </div>
          <span>$180</span>
        </div>
        <div className="list-row">
          <div>
            <strong>#1040</strong>
            <span>Business bundle</span>
          </div>
          <span>$540</span>
        </div>
      </div>
    </section>
  )
}
