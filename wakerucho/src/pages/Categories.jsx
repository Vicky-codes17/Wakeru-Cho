export default function Categories() {
  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Manage</p>
          <h2>Categories</h2>
        </div>
        <button type="button" className="action-button">Add category</button>
      </div>

      <div className="list-card">
        {[
          ['Marketing', '$4,280'],
          ['Operations', '$2,990'],
          ['Freelance', '$1,760'],
          ['Software', '$3,150'],
        ].map(([label, amount]) => (
          <div className="list-row" key={label}>
            <div>
              <strong>{label}</strong>
              <span>Monthly budget</span>
            </div>
            <strong>{amount}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
