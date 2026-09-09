import React, { useEffect, useState } from 'react'

export default function AddClientModal({ isOpen, onClose, onSave, initialData }) {
  const isEdit = Boolean(initialData)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Active')
  const [projectRate, setProjectRate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setCompany(initialData.company || '')
      setEmail(initialData.email || '')
      setPhone(initialData.phone || '')
      setStatus(initialData.status || 'Active')
      setProjectRate(initialData.project_rate != null ? String(initialData.project_rate) : '')
      setNotes(initialData.notes || '')
    } else {
      setName('')
      setCompany('')
      setEmail('')
      setPhone('')
      setStatus('Active')
      setProjectRate('')
      setNotes('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  async function submit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave(
        {
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          status,
          project_rate: projectRate ? Number(projectRate) : null,
          notes: notes.trim(),
        },
        isEdit,
      )
    } catch (err) {
      console.error(err)
      alert('Failed to save client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="z-10 w-full max-w-2xl">
        <form
          onSubmit={submit}
          className="rounded-[22px] bg-[#ffffff] p-6 ring-1 ring-[#e8e2dc] shadow-[0_18px_40px_rgba(17,17,17,0.12)]"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em] text-[#7a7672]">Clients</p>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">
                {isEdit ? 'Edit Client' : 'Add Client'}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Client name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="Jordan Lee"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Company</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="Studio North"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="client@studio.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="+91 98765 43210"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Project value</span>
              <input
                value={projectRate}
                onChange={(e) => setProjectRate(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="25000"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[13px] font-medium text-[#63605d]">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-[12px] border border-[#e7e2dd] bg-[#fbfaf8] px-3 py-2.5 text-[13px] text-[#1f1d1b] outline-none transition focus:border-[#79e0b1]"
                placeholder="Project scope, preferences, reminders..."
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e7e2dd] bg-[#ffffff] px-4 py-2 text-[13px] font-medium text-[#4d4946] transition hover:bg-[#f7f4f2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#79e0b1] px-4 py-2 text-[13px] font-semibold text-[#0d0d0d] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}