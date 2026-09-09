import { useMemo, useState } from 'react'
import useClients from '../hooks/useClients'
import AddClientModal from '../components/freelancing/AddClientModal'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const statusLabels = {
  all: 'All',
  active: 'Active',
  prospect: 'Prospect',
  inactive: 'Inactive',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function Freelancing() {
  const { clients, loading, error, needsAuth, addClient, updateClient, deleteClient } = useClients()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesTab = tab === 'all' ? true : client.status === tab
      const haystack = [client.name, client.company, client.email, client.phone, client.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesQuery = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true
      return matchesTab && matchesQuery
    })
  }, [clients, query, tab])

  const activeClients = clients.filter((client) => client.status === 'active')
  const prospectClients = clients.filter((client) => client.status === 'prospect')
  const inactiveClients = clients.filter((client) => client.status === 'inactive')
  const totalValue = clients.reduce((sum, client) => sum + Number(client.project_rate || 0), 0)

  function handleCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(client) {
    setEditing(client)
    setModalOpen(true)
  }

  async function handleDelete(client) {
    const ok = window.confirm(`Delete ${client.name}?`)
    if (!ok) return

    try {
      await deleteClient(client.id)
    } catch (err) {
      console.error(err)
      alert('Failed to delete client')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] text-[#63605d]">Manage</p>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">Freelancing</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {needsAuth ? (
              <button
                type="button"
                className="rounded-full bg-[#f0efed] px-4 py-2 text-[14px] text-[#5f5b58] ring-1 ring-[#ebe5e1]"
                onClick={() => (window.location.pathname = '/login')}
              >
                Login to manage clients
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-[#79e0b1] px-4 py-2 text-[14px] font-semibold text-[#0d0d0d]"
                onClick={handleCreate}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Client
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-[#e8e2dc]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Total clients</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em] text-[#181715]">
              {clients.length}
            </strong>
          </article>
          <article className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-[#e8e2dc]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Active clients</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em] text-[#181715]">
              {activeClients.length}
            </strong>
          </article>
          <article className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-[#e8e2dc]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Pipeline value</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em] text-[#181715]">
              {currency.format(totalValue)}
            </strong>
          </article>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 rounded-full bg-[#ece8e4] p-1 text-[12px] text-[#5f5a57]">
            {Object.keys(statusLabels).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-full px-3 py-2 transition ${tab === key ? 'bg-white text-[#131313] shadow-sm' : ''}`}
              >
                {statusLabels[key]}
              </button>
            ))}
          </div>

          <label className="flex w-full max-w-md items-center gap-2 rounded-full bg-[#f0efed] px-4 py-2.5 text-[13px] text-[#5f5b58] ring-1 ring-[#ebe5e1]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16l4 4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-[#847f7b]"
              placeholder="Search clients"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e7e1dc] bg-[#f5f4f2]">
          <div className="grid grid-cols-[1.5fr_1fr_0.9fr_0.9fr_0.9fr] gap-3 bg-[#f1efed] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#69625d]">
            <span>Client</span>
            <span>Contact</span>
            <span>Status</span>
            <span>Value</span>
            <span>Actions</span>
          </div>

          {loading && <div className="px-4 py-6 text-center text-[#5f5a57]">Loading...</div>}

          {!loading && filteredClients.length === 0 && (
            <div className="px-4 py-8 text-center text-[#7a7672]">No clients found.</div>
          )}

          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-[1.5fr_1fr_0.9fr_0.9fr_0.9fr] items-center gap-3 border-t border-[#e7e1dc] px-4 py-4 text-[13px] text-[#2b2a2a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ece8e4] text-[11px] font-semibold text-[#181715]">
                  {getInitials(client.name)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-[#1f1d1b]">{client.name}</div>
                  <div className="truncate text-[12px] text-[#726d6a]">{client.company || 'Independent client'}</div>
                </div>
              </div>

              <div className="min-w-0 text-[12px] text-[#726d6a]">
                <div className="truncate">{client.email || 'No email'}</div>
                <div className="truncate">{client.phone || 'No phone'}</div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${
                    client.status === 'active'
                      ? 'bg-[#e7fbf0] text-[#1e7d4d]'
                      : client.status === 'prospect'
                        ? 'bg-[#fff4df] text-[#8a5c14]'
                        : 'bg-[#f3f0ed] text-[#6f6863]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      client.status === 'active'
                        ? 'bg-[#79e0b1]'
                        : client.status === 'prospect'
                          ? 'bg-[#f1c14f]'
                          : 'bg-[#bdb7b1]'
                    }`}
                  />
                  {statusLabels[client.status] || 'Active'}
                </span>
              </div>

              <div className="text-[13px] text-[#2b2a2a]">
                {client.project_rate ? currency.format(client.project_rate) : '—'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(client)}
                  className="rounded-[10px] bg-[#ffffff] px-3 py-1 ring-1 ring-[#e7e2dd] text-[13px]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(client)}
                  className="rounded-[10px] bg-[#fff1f1] px-3 py-1 text-[13px] text-[#c01f1f] ring-1 ring-[#f5d6d6]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <AddClientModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={async (payload, isEdit) => {
            try {
              if (isEdit && editing) {
                await updateClient(editing.id, payload)
              } else {
                await addClient(payload)
              }

              setModalOpen(false)
              setEditing(null)
            } catch (err) {
              console.error(err)
              alert('Failed to save client')
            }
          }}
          initialData={editing}
        />

        {needsAuth ? (
          <div className="mt-6 rounded-[12px] border border-[#f3dcc4] bg-[#fff4e6] px-4 py-4 text-[#7a5a2a]">
            Please log in to view and manage your clients.{' '}
            <button type="button" className="ml-2 underline" onClick={() => (window.location.pathname = '/login')}>
              Go to login
            </button>
          </div>
        ) : error ? (
          <div className="mt-4 text-[#c01f1f]">Error: {String(error.message || error)}</div>
        ) : null}
      </div>
    </div>
  )
}
