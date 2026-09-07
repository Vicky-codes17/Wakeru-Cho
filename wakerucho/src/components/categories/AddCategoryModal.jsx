import React, { useEffect, useState } from 'react'

export default function AddCategoryModal({ isOpen, onClose, onSave, initialData }) {
  const isEdit = Boolean(initialData)
  const [name, setName] = useState('')
  const [type, setType] = useState('expense')
  const [budget, setBudget] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setType(initialData.type || 'expense')
      setBudget(initialData.budget_limit != null ? String(initialData.budget_limit) : '')
    } else {
      setName('')
      setType('expense')
      setBudget('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        budget_limit: budget ? Number(budget) : null,
        type,
      }
      await onSave(payload, isEdit)
    } catch (err) {
      console.error(err)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="z-10 max-w-md w-full">
        <form onSubmit={submit} className="rounded-[18px] bg-white ring-1 ring-[#e8e2dc] shadow-[0_18px_40px_rgba(17,17,17,0.12)] p-6">
          <h2 className="text-[17px] font-semibold mb-4 text-[#1a1a1a]">{isEdit ? 'Edit Category' : 'Add Category'}</h2>

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#63605d] mb-2">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#e7e2dd] rounded px-3 py-2 text-[13px]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#63605d] mb-2">Type</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={() => setType('income')}
                  disabled={isEdit}
                />
                <span className="text-[13px]">Income</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={() => setType('expense')}
                  disabled={isEdit}
                />
                <span className="text-[13px]">Expense</span>
              </label>
            </div>
          </div>

          {type === 'expense' && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#63605d] mb-2">Budget Limit (optional)</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full border border-[#e7e2dd] rounded px-3 py-2 text-[13px]"
                placeholder="5000"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-[10px] border border-[#e7e2dd] text-[13px]">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-[10px] bg-[#79e0b1] text-[13px] font-semibold">
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
