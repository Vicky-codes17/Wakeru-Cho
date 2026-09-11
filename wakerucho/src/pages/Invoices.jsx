import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useInvoices from '../hooks/useInvoices'
import AddInvoiceModal from '../components/invoices/AddInvoiceModal'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const statusOptions = ['all', 'Draft', 'Sent', 'Paid', 'Overdue']

export default function Invoices() {
  const navigate = useNavigate()
  const location = useLocation()
  const { invoices, clients, loading, error, needsAuth, addInvoice, updateInvoice, deleteInvoice } = useInvoices()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [prefillClientId, setPrefillClientId] = useState(location.state?.clientId || '')

  useEffect(() => {
    if (location.state?.clientId) {
      setPrefillClientId(location.state.clientId)
      setModalOpen(true)
    }
  }, [location.state])

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesTab = tab === 'all' ? true : invoice.status === tab
      const haystack = [invoice.invoice_number, invoice.client?.name, invoice.client?.company, invoice.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesQuery = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true
      return matchesTab && matchesQuery
    })
  }, [invoices, query, tab])

  const totalOutstanding = invoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + Number(invoice.total || 0), 0)
  const overdueCount = invoices.filter((invoice) => invoice.is_overdue).length
  const paidCount = invoices.filter((invoice) => invoice.status === 'Paid').length

  function handleCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(invoice) {
    setEditing(invoice)
    setModalOpen(true)
  }

  async function handleDelete(invoice) {
    const ok = window.confirm(`Delete invoice ${invoice.invoice_number}?`)
    if (!ok) return

    try {
      await deleteInvoice(invoice.id)
    } catch (err) {
      console.error(err)
      alert('Failed to delete invoice')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] text-[#63605d]">Freelancing</p>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">Invoices</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-[#e7e2dd] bg-white px-4 py-2 text-[14px] font-semibold text-[#1b1a19]"
              onClick={() => navigate('/freelancing')}
            >
              Back to clients
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#79e0b1] px-4 py-2 text-[14px] font-semibold text-[#0d0d0d]"
              onClick={handleCreate}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              New Invoice
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-[22px] bg-[#0f0f0f] p-4 text-white">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-white/60">Outstanding</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em]">{currency.format(totalOutstanding)}</strong>
          </article>
          <article className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-[#e8e2dc]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Paid invoices</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em] text-[#181715]">{paidCount}</strong>
          </article>
          <article className="rounded-[22px] bg-[#fbfaf8] p-4 ring-1 ring-[#e8e2dc]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Overdue</span>
            <strong className="mt-2 block text-[28px] font-semibold tracking-[-0.04em] text-[#181715]">{overdueCount}</strong>
          </article>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 rounded-full bg-[#ece8e4] p-1 text-[12px] text-[#5f5a57]">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={`rounded-full px-3 py-2 transition ${tab === option ? 'bg-white text-[#131313] shadow-sm' : ''}`}
              >
                {option === 'all' ? 'All' : option}
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
              placeholder="Search invoices"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e7e1dc] bg-[#f5f4f2]">
          <div className="hidden grid-cols-[1.2fr_1.4fr_0.8fr_0.9fr_0.9fr] gap-3 bg-[#f1efed] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#69625d] md:grid">
            <span>Invoice</span>
            <span>Client</span>
            <span>Status</span>
            <span>Total</span>
            <span>Actions</span>
          </div>

          {loading && <div className="px-4 py-6 text-center text-[#5f5a57]">Loading...</div>}

          {!loading && filteredInvoices.length === 0 && (
            <div className="px-4 py-8 text-center text-[#7a7672]">No invoices found.</div>
          )}

          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="grid cursor-pointer grid-cols-1 gap-3 border-t border-[#e7e1dc] px-4 py-4 text-[13px] text-[#2b2a2a] md:grid-cols-[1.2fr_1.4fr_0.8fr_0.9fr_0.9fr] md:items-center"
              onClick={() => navigate(`/invoices/${invoice.id}`)}
            >
              <div>
                <div className="font-medium text-[#1f1d1b]">{invoice.invoice_number}</div>
                <div className="text-[12px] text-[#726d6a]">Due {invoice.due_date || '—'}</div>
              </div>
              <div>
                <div className="font-medium text-[#1f1d1b]">{invoice.client?.name || 'Unknown client'}</div>
                <div className="text-[12px] text-[#726d6a]">{invoice.client?.company || 'Independent client'}</div>
              </div>
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${invoice.status === 'Paid' ? 'bg-[#e7fbf0] text-[#1e7d4d]' : invoice.is_overdue ? 'bg-[#fff1f1] text-[#c01f1f]' : 'bg-[#f3f0ed] text-[#6f6863]'}`}>
                  <span className={`h-2 w-2 rounded-full ${invoice.status === 'Paid' ? 'bg-[#79e0b1]' : invoice.is_overdue ? 'bg-[#ff9090]' : 'bg-[#bdb7b1]'}`} />
                  {invoice.status}
                </span>
              </div>
              <div className="font-medium text-[#1f1d1b]">{currency.format(invoice.total || 0)}</div>
              <div className="flex items-center gap-2 md:justify-end" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleEdit(invoice)}
                  className="rounded-[10px] bg-[#ffffff] px-3 py-1 ring-1 ring-[#e7e2dd] text-[13px]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(invoice)}
                  className="rounded-[10px] bg-[#fff1f1] px-3 py-1 text-[13px] text-[#c01f1f] ring-1 ring-[#f5d6d6]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {error ? <div className="text-[#c01f1f]">Error: {String(error.message || error)}</div> : null}
        {needsAuth ? <div className="rounded-[12px] border border-[#f3dcc4] bg-[#fff4e6] px-4 py-4 text-[#7a5a2a]">Please log in to manage invoices.</div> : null}

        <AddInvoiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
            setPrefillClientId('')
          }}
          clients={clients}
          initialData={editing || (prefillClientId ? { client_id: prefillClientId } : null)}
          onSave={async (payload, isEdit) => {
            const nextPayload = { ...payload, client_id: payload.client_id || prefillClientId }
            const saved = isEdit && editing ? await updateInvoice(editing.id, nextPayload) : await addInvoice(nextPayload)
            setModalOpen(false)
            setEditing(null)
            setPrefillClientId('')
            navigate(`/invoices/${saved.id}`)
          }}
        />
      </div>
    </div>
  )
}