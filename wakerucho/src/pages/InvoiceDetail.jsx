import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useInvoices from '../hooks/useInvoices'
import AddInvoiceModal from '../components/invoices/AddInvoiceModal'
import MarkPaidModal from '../components/invoices/MarkPaidModal'
import { downloadInvoicePdf } from '../lib/invoicePdf'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function InvoiceDetail() {
  const navigate = useNavigate()
  const { invoiceId } = useParams()
  const { invoices, clients, loading, error, needsAuth, updateInvoice, deleteInvoice, markAsPaid } = useInvoices()
  const [editing, setEditing] = useState(false)
  const [markPaidOpen, setMarkPaidOpen] = useState(false)

  const invoice = useMemo(() => invoices.find((entry) => entry.id === invoiceId), [invoices, invoiceId])

  async function handleDelete() {
    const ok = window.confirm(`Delete invoice ${invoice?.invoice_number || ''}?`)
    if (!ok || !invoice) return
    await deleteInvoice(invoice.id)
    navigate('/invoices')
  }

  if (loading && !invoice) {
    return <div className="rounded-[24px] bg-[#f5f4f2] p-6 text-[#5f5a57] ring-1 ring-[#ece5e0]">Loading invoice...</div>
  }

  if (!invoice && !loading) {
    return (
      <div className="rounded-[24px] bg-[#f5f4f2] p-6 ring-1 ring-[#ece5e0]">
        <p className="text-[#5f5a57]">Invoice not found.</p>
        <Link to="/invoices" className="mt-3 inline-block rounded-full bg-[#79e0b1] px-4 py-2 font-semibold text-[#0d0d0d]">
          Back to invoices
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] text-[#63605d]">Invoice detail</p>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">{invoice.invoice_number}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadInvoicePdf(invoice)} className="rounded-full border border-[#e7e2dd] bg-white px-4 py-2 text-[14px] font-medium text-[#1b1a19]">
              Download PDF
            </button>
            {invoice.status !== 'Paid' ? (
              <button type="button" onClick={() => setMarkPaidOpen(true)} className="rounded-full bg-[#79e0b1] px-4 py-2 text-[14px] font-semibold text-[#0d0d0d]">
                Mark as paid
              </button>
            ) : null}
            <button type="button" onClick={() => setEditing(true)} className="rounded-full border border-[#e7e2dd] bg-white px-4 py-2 text-[14px] font-medium text-[#1b1a19]">
              Edit
            </button>
            <button type="button" onClick={handleDelete} className="rounded-full bg-[#fff1f1] px-4 py-2 text-[14px] font-medium text-[#c01f1f]">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[24px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
          <div className="flex items-center justify-between gap-3 border-b border-[#e8e2dc] pb-4">
            <div>
              <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Client</span>
              <strong className="mt-1 block text-[18px] text-[#1b1a19]">{invoice.client?.name || 'Unknown client'}</strong>
              <p className="text-[13px] text-[#726d6a]">{invoice.client?.company || 'Independent client'}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[12px] ${invoice.status === 'Paid' ? 'bg-[#e7fbf0] text-[#1e7d4d]' : invoice.is_overdue ? 'bg-[#fff1f1] text-[#c01f1f]' : 'bg-[#f3f0ed] text-[#6f6863]'}`}>
              {invoice.status}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#e8e2dc]">
              <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Issue date</span>
              <strong className="mt-1 block text-[15px] text-[#1b1a19]">{invoice.issue_date || '—'}</strong>
            </div>
            <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#e8e2dc]">
              <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Due date</span>
              <strong className="mt-1 block text-[15px] text-[#1b1a19]">{invoice.due_date || '—'}</strong>
            </div>
            <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#e8e2dc]">
              <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Payment</span>
              <strong className="mt-1 block text-[15px] text-[#1b1a19]">{invoice.payment_method || '—'}</strong>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[20px] border border-[#e7e1dc] bg-white">
            <div className="hidden grid-cols-[1.5fr_0.4fr_0.5fr_0.5fr] gap-3 bg-[#f1efed] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#69625d] md:grid">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            {invoice.items.map((item) => (
              <div key={item.id || `${item.description}-${item.rate}`} className="grid gap-3 border-t border-[#e7e1dc] px-4 py-4 text-[13px] md:grid-cols-[1.5fr_0.4fr_0.5fr_0.5fr] md:items-center">
                <span className="font-medium text-[#1f1d1b]">{item.description}</span>
                <span>{item.quantity}</span>
                <span>{currency.format(item.rate)}</span>
                <span>{currency.format(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#0f0f0f] p-4 text-white">
            <p className="text-[12px] uppercase tracking-[0.12em] text-white/60">Summary</p>
            <div className="mt-3 space-y-3 text-[14px]">
              <div className="flex items-center justify-between"><span>Subtotal</span><strong>{currency.format(invoice.subtotal)}</strong></div>
              <div className="flex items-center justify-between"><span>Tax</span><strong>{currency.format(invoice.tax_amount)}</strong></div>
              <div className="flex items-center justify-between"><span>Discount</span><strong>{currency.format(invoice.discount_amount)}</strong></div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[18px]"><span>Total</span><strong>{currency.format(invoice.total)}</strong></div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
            <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Notes</span>
            <p className="mt-2 text-[14px] leading-6 text-[#34302d]">{invoice.notes || 'No notes for this invoice.'}</p>
          </div>
        </div>
      </div>

      {editing ? (
        <AddInvoiceModal
          isOpen={editing}
          onClose={() => setEditing(false)}
          clients={clients}
          initialData={invoice}
          onSave={async (payload) => {
            await updateInvoice(invoice.id, payload)
            setEditing(false)
          }}
        />
      ) : null}

      {markPaidOpen ? (
        <MarkPaidModal
          isOpen={markPaidOpen}
          invoice={invoice}
          onClose={() => setMarkPaidOpen(false)}
          onConfirm={async (payload) => {
            await markAsPaid(invoice.id, payload)
            setMarkPaidOpen(false)
          }}
        />
      ) : null}

      {needsAuth ? <div className="rounded-[12px] border border-[#f3dcc4] bg-[#fff4e6] px-4 py-4 text-[#7a5a2a]">Please log in to view invoices.</div> : null}
      {error ? <div className="text-[#c01f1f]">Error: {String(error.message || error)}</div> : null}
    </div>
  )
}