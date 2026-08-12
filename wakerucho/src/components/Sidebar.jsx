export default function Sidebar({ items, activeItem, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label">Menu</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
            onClick={() => onSelect(item.label)}
          >
            <span>{item.label}</span>
            <span className="nav-bullet" aria-hidden="true">•</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
