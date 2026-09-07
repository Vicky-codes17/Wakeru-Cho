import React, { useState } from 'react'
import useCategories from '../hooks/useCategories'
import AddCategoryModal from '../components/categories/AddCategoryModal'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function Categories() {
  const { categories, loading, error, needsAuth, addCategory, updateCategory, deleteCategory, getLinkedCount } = useCategories()
  const [tab, setTab] = useState('all')
  const [isModalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function filtered() {
    if (tab === 'all') return categories
    return categories.filter((c) => c.type === tab)
  }

  async function handleEdit(cat) {
    setEditing(cat)
    setModalOpen(true)
  }

  async function handleDelete(cat) {
    try {
      const linked = await getLinkedCount(cat.id)
      const ok = window.confirm(`This category is linked to ${linked} transaction(s). Delete?`)
      if (!ok) return
      await deleteCategory(cat.id)
      // refresh handled by hook
    } catch (err) {
      console.error(err)
      alert('Failed to delete category')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#63605d]">Manage</p>
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">Categories</h3>
          </div>

          <div className="flex items-center gap-3">
            {needsAuth ? (
              <button
                className="px-4 py-2 rounded-full bg-[#f0efed] text-[#5f5b58] ring-1 ring-[#ebe5e1]"
                onClick={() => (window.location.pathname = '/login')}
              >
                Login to manage categories
              </button>
            ) : (
              <button
                className="flex items-center gap-2 rounded-full bg-[#79e0b1] px-4 py-2 text-[14px] font-semibold text-[#0d0d0d]"
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Category
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2 rounded-full bg-[#ece8e4] p-1 text-[12px] text-[#5f5a57]">
            {['all', 'income', 'expense'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 rounded-full ${tab === t ? 'bg-white text-[#131313] shadow-sm' : ''}`}
              >
                {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[#e7e1dc] bg-[#f5f4f2]">
          <div className="grid grid-cols-[2fr_0.8fr_2fr_0.8fr] gap-3 bg-[#f1efed] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#69625d]">
            <span>Name</span>
            <span>Type</span>
            <span>Budget / Usage</span>
            <span>Actions</span>
          </div>

          {loading && (
            <div className="px-4 py-6 text-center text-[#5f5a57]">Loading...</div>
          )}

          {!loading && filtered().length === 0 && (
            <div className="px-4 py-8 text-center text-[#7a7672]">No categories found.</div>
          )}

          {filtered().map((c) => {
            const usage = Number(c.usage || 0)
            const budget = c.budget_limit ? Number(c.budget_limit) : null
            const percent = budget && budget > 0 ? Math.round((usage / budget) * 100) : null
            return (
              <div key={c.id} className="grid grid-cols-[2fr_0.8fr_2fr_0.8fr] items-center gap-3 border-t border-[#e7e1dc] px-4 py-4 text-[13px] text-[#2b2a2a]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ece8e4] text-[11px] font-semibold text-[#181715]">{(c.name || '').slice(0,2)}</div>
                  <span className="font-medium text-[#1f1d1b]">{c.name}</span>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-2 text-[12px] ${c.type === 'income' ? 'text-[#1e7d4d]' : 'text-[#c01f1f]'}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${c.type === 'income' ? 'bg-[#7be8bf]' : 'bg-[#ffd6d6]'}`} />
                    {c.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>

                <div>
                  {c.type === 'expense' ? (
                    <div className="space-y-2 max-w-md">
                      {budget ? (
                        <>
                          <div className="flex items-baseline justify-between text-sm">
                            <div className={percent >= 100 ? 'text-[#c01f1f] font-medium' : 'text-[#2b2a2a]'}>
                              {currency.format(usage)} / {currency.format(budget)} — {percent}%
                            </div>
                          </div>
                          <div className="w-full bg-[#e6e3df] rounded h-2">
                            <div
                              className={`h-2 rounded ${percent >= 100 ? 'bg-[#c01f1f]' : 'bg-[#79e0b1]'}`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-[#726d6a]">{currency.format(usage)} spent this month</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-[#726d6a]">{currency.format(usage)} earned this month</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 rounded-[10px] bg-[#ffffff] ring-1 ring-[#e7e2dd] text-[13px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="px-3 py-1 rounded-[10px] bg-[#fff1f1] ring-1 ring-[#f5d6d6] text-[13px] text-[#c01f1f]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={async (payload, isEdit) => {
            try {
              if (isEdit && editing) {
                await updateCategory(editing.id, payload)
              } else {
                await addCategory(payload)
              }
              setModalOpen(false)
            } catch (err) {
              console.error(err)
              alert('Failed to save category')
            }
          }}
          initialData={editing}
        />

        {needsAuth ? (
          <div className="mt-6 px-4 py-4 rounded-[12px] bg-[#fff4e6] border border-[#f3dcc4] text-[#7a5a2a]">Please log in to view and manage your categories. <button className="underline ml-2" onClick={() => (window.location.pathname = '/login')}>Go to login</button></div>
        ) : error ? (
          <div className="mt-4 text-[#c01f1f]">Error: {String(error.message || error)}</div>
        ) : null}
      </div>
    </div>
  )
}

