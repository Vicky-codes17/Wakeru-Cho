export default function Topbar({ user, onSignOutRequest }) {
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'My Account'

  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="topbar">
      <div className="brand-wrap">
        <img src="/WakeruCho-Logo.png" alt="WakeruCho logo" className="brand-logo" />
        <div className="brand-name">WakeruCho</div>
      </div>

      <div className="search-wrap">
        <div className="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Search</span>
        </div>
      </div>

      <div className="profile-area">
        <button className="icon-button" aria-label="Notifications" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="logged-user-pill" aria-label="Logged in user profile">
          <div className="logged-user-avatar">{initials}</div>
          <span className="logged-user-name">{displayName}</span>
          <button type="button" className="sign-out-button" onClick={onSignOutRequest}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
