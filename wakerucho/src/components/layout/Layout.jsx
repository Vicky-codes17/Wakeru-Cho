import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Overview', path: '/' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Categories', path: '/categories' },
  { label: 'Freelancing', path: '/freelancing' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, showSignOutConfirm, setShowSignOutConfirm } = useAuth()

  const activeItem =
    navItems.find((item) => item.path === location.pathname)?.label ?? 'Overview'

  const handleSidebarSelect = (value) => {
    const selected = navItems.find((item) => item.label === value)
    if (selected) navigate(selected.path)
  }

  return (
    <div className="page-shell">
      <Topbar user={user} onSignOutRequest={() => setShowSignOutConfirm(true)} />

      <main className="dashboard-shell">
        <Sidebar
          items={navItems.map(({ label }) => ({ label }))}
          activeItem={activeItem}
          onSelect={handleSidebarSelect}
        />

        <section className="content-panel">
          <Outlet />
        </section>
      </main>

      {showSignOutConfirm && (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal-card">
            <h3>Are you sure you want to sign out?</h3>
            <p>You can sign back in anytime.</p>

            <div className="confirm-actions">
              <button type="button" className="cancel-button" onClick={() => setShowSignOutConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="confirm-signout-button"
                onClick={async () => {
                  await signOut()
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
