import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AddTransactionModal from './AddTransaction'

/* ── category icon map ─────────────────────────── */
const CAT_ICONS = {
  'Food & Dining': ' 🍽️ ',
  'Shopping': ' 🛍️ ',
  'Transport': ' 🚗 ',
  'Entertainment': ' 🎬 ',
  'Health & Fitness': ' 🏃 ',
  'Utilities': ' ⚡ ',
  'Housing & Rent': '🏠',
  'Education': '📚',
  'Subscriptions': '🔄',
  'Travel': '✈️',
  'Personal Care': '✨',
  'Salary': '💼',
  'Freelance': '💻',
  'Business': '📈',
  'Investment Returns': '💰',
  'Rental Income': '🏡',
  'Gift': '🎁',
  'Bonus': '🎉',
  'Other': '📌',
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupByDate(rows) {
  const groups = {}
  for (const row of rows) {
    const key = row.date || 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(row)
  }
  return Object.entries(groups)
}

export default function Transactions() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchTransactions = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(80)
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchTransactions() }, [user])

  /* summary stats */
  const totalIncome = rows.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0)
  const totalExpense = rows.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0)
  const net = totalIncome - totalExpense

  const groups = groupByDate(rows)

  return (
    <div className="txp-shell">

      {/* ── Header row ── */}
      <div className="txp-header">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>Finance</p>
          <h2 className="txp-title">Transactions</h2>
        </div>
        <button
          type="button"
          id="add-transaction-btn"
          className="txp-add-btn"
          onClick={() => setShowModal(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="txp-add-icon">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* ── Summary strip ── */}
      {!loading && rows.length > 0 && (
        <div className="txp-summary">
          <div className="txp-stat txp-stat--income">
            <span className="txp-stat-label">Income</span>
            <span className="txp-stat-value">+${totalIncome.toFixed(2)}</span>
          </div>
          <div className="txp-stat-divider" />
          <div className="txp-stat txp-stat--expense">
            <span className="txp-stat-label">Expenses</span>
            <span className="txp-stat-value">−${totalExpense.toFixed(2)}</span>
          </div>
          <div className="txp-stat-divider" />
          <div className={`txp-stat ${net >= 0 ? 'txp-stat--income' : 'txp-stat--expense'}`}>
            <span className="txp-stat-label">Net</span>
            <span className="txp-stat-value">{net >= 0 ? '+' : '−'}${Math.abs(net).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* ── List ── */}
      <div className="txp-list">
        {loading && (
          <div className="txp-empty">
            <div className="txp-spinner-ring" />
            <p>Loading transactions…</p>
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="txp-empty">
            <div className="txp-empty-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            </div>
            <p className="txp-empty-title">No transactions yet</p>
            <p className="txp-empty-sub">Tap <strong>Add Transaction</strong> to get started.</p>
          </div>
        )}

        {!loading && groups.map(([dateKey, items]) => (
          <div key={dateKey} className="txp-group">
            {/* Date header */}
            <div className="txp-date-header">
              <span>{formatDate(dateKey)}</span>
              <span className="txp-date-full">
                {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Rows */}
            {items.map((row) => (
              <div className={`txp-row txp-row--${row.type}`} key={row.id}>
                {/* Icon */}
                <div className={`txp-icon txp-icon--${row.type}`}>
                  {CAT_ICONS[row.category] ?? '📌'}
                </div>

                {/* Info */}
                <div className="txp-info">
                  <span className="txp-name">
                    {row.description || row.category}
                  </span>
                  <div className="txp-meta">
                    <span className="txp-tag">{row.category}</span>
                    <span className="txp-sep">·</span>
                    <span>{row.payment_method}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="txp-amount-col">
                  <span className={`txp-amount txp-amount--${row.type}`}>
                    {row.type === 'income' ? '+' : '−'}${Number(row.amount).toFixed(2)}
                  </span>
                  <span className={`txp-badge txp-badge--${row.type}`}>
                    {row.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSaved={fetchTransactions}
        />
      )}
    </div>
  )
}
