import { useEffect, useState } from 'react'

export default function MarkPaidModal({ isOpen, invoice, onClose, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('Bank Transfer')
      setPaidAt(new Date().toISOString().split('T')[0])
      setError('')
      setSaving(false)
    }
  }, [isOpen])

  if (!isOpen || !invoice) return null

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await onConfirm({ payment_method: paymentMethod, paid_at: paidAt })
    } catch (err) {
      setError(err?.message || 'Unable to mark invoice as paid')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-[24px] bg-white p-5 shadow-[0_24px_60px_rgba(17,17,17,0.18)]">
        <p className="text-[12px] uppercase tracking-[0.14em] text-[#7a7672]">Payment received</p>
        <h2 className="mt-1 text-[21px] font-semibold tracking-[-0.03em] text-[#171514]">Mark invoice as paid</h2>
        <p className="mt-2 text-[14px] text-[#5f5a57]">
          This will update the invoice and insert an income transaction for {invoice.invoice_number}.
        </p>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Payment method</span>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none">
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Paid date</span>
            <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] outline-none" />
          </label>

          {error ? <div className="rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[13px] text-[#c01f1f] ring-1 ring-[#f5d6d6]">{error}</div> : null}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[#e7e2dd] bg-white px-4 py-3 text-[14px] font-medium text-[#1b1a19]">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 rounded-full bg-[#79e0b1] px-4 py-3 text-[14px] font-semibold text-[#0d0d0d] disabled:opacity-70">
            {saving ? 'Saving...' : 'Confirm paid'}
          </button>
        </div>
      </form>
    </div>
  )
}