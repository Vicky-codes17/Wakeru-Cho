import { useEffect, useMemo, useState } from 'react'
import { calculateTotals } from '../../hooks/useInvoices'

function blankItem() {
  return { description: '', quantity: 1, rate: '' }
}

export default function AddInvoiceModal({ isOpen, onClose, onSave, clients, initialData }) {
  const isEdit = Boolean(initialData)
  const [clientId, setClientId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [taxRate, setTaxRate] = useState('0')
  const [discountAmount, setDiscountAmount] = useState('0')
  const [status, setStatus] = useState('Draft')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([blankItem()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.client_id || '')
      setInvoiceNumber(initialData.invoice_number || '')
      setIssueDate(initialData.issue_date || '')
      setDueDate(initialData.due_date || '')
      setTaxRate(String(initialData.tax_rate ?? 0))
      setDiscountAmount(String(initialData.discount_amount ?? 0))
      setStatus(initialData.status || 'Draft')
      setNotes(initialData.notes || '')
      setItems(
        (initialData.items || []).length
          ? initialData.items.map((item) => ({
              description: item.description || '',
              quantity: item.quantity ?? 1,
              rate: item.rate ?? '',
            }))
          : [blankItem()],
      )
    } else {
      setClientId(clients?.[0]?.id || '')
      setInvoiceNumber('')
      setIssueDate('')
      setDueDate('')
      setTaxRate('0')
      setDiscountAmount('0')
      setStatus('Draft')
      setNotes('')
      setItems([blankItem()])
    }
  }, [initialData, isOpen, clients])

  const totals = useMemo(() => calculateTotals(items, taxRate, discountAmount), [items, taxRate, discountAmount])

  if (!isOpen) return null

  function updateItem(index, key, value) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))
  }

  function addItem() {
    setItems((current) => [...current, blankItem()])
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await onSave(
        {
          client_id: clientId,
          invoice_number: invoiceNumber,
          issue_date: issueDate,
          due_date: dueDate,
          status,
          tax_rate: taxRate,
          discount_amount: discountAmount,
          notes,
          items,
        },
        isEdit,
      )
    } catch (err) {
      setError(err?.message || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(17,17,17,0.18)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#f0ece8] bg-[#f5f3f1] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#7a7672]">Invoices</p>
            <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#171514]">
              {isEdit ? 'Edit invoice' : 'Create invoice'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white p-2 text-[#6a645e] ring-1 ring-[#e8e2dc]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Client</span>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none"
                >
                  <option value="" disabled>
                    Select client
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Invoice number</span>
                <input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Auto generated if empty"
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Issue date</span>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Due date</span>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none"
                />
              </label>
            </div>

            <div className="rounded-[22px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Line items</p>
                  <h3 className="text-[16px] font-semibold text-[#1b1a19]">Build the invoice</h3>
                </div>
                <button type="button" onClick={addItem} className="rounded-full bg-white px-3 py-2 text-[13px] font-medium ring-1 ring-[#e7e2dd]">
                  Add item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={`${index}-${item.description}`} className="grid gap-3 rounded-[18px] bg-white p-3 ring-1 ring-[#e8e2dc] md:grid-cols-[1.4fr_0.35fr_0.45fr_auto]">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2 text-[13px] outline-none"
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2 text-[13px] outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      placeholder="Rate"
                      className="rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2 text-[13px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-[12px] border border-[#f5d6d6] bg-[#fff1f1] px-3 py-2 text-[13px] font-medium text-[#c01f1f]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Payment instructions or project notes"
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] bg-[#0f0f0f] px-4 py-4 text-white">
              <p className="text-[12px] uppercase tracking-[0.12em] text-white/60">Auto totals</p>
              <div className="mt-3 space-y-3 text-[14px]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <strong>₹{totals.subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax ({taxRate || 0}%)</span>
                  <strong>₹{totals.tax_amount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <strong>₹{totals.discount_amount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[18px]">
                  <span>Total</span>
                  <strong>₹{totals.total.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-[22px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Tax rate %</span>
                <input
                  type="number"
                  min="0"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-white px-3 py-2.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Discount amount</span>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full rounded-[12px] border border-[#e7e2dd] bg-white px-3 py-2.5 text-[13px] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-[12px] border border-[#e7e2dd] bg-white px-3 py-2.5 text-[13px] outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </label>
            </div>

            {error ? <div className="rounded-[16px] bg-[#fff1f1] px-4 py-3 text-[13px] text-[#c01f1f] ring-1 ring-[#f5d6d6]">{error}</div> : null}

            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[#e7e2dd] bg-white px-4 py-3 text-[14px] font-medium text-[#1b1a19]">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 rounded-full bg-[#79e0b1] px-4 py-3 text-[14px] font-semibold text-[#0d0d0d] disabled:opacity-70">
                {saving ? 'Saving...' : isEdit ? 'Save invoice' : 'Create invoice'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}