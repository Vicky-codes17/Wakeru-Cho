import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transport', 'Entertainment',
  'Health & Fitness', 'Utilities', 'Housing & Rent', 'Education',
  'Subscriptions', 'Travel', 'Personal Care', 'Other',
]
const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment Returns',
  'Rental Income', 'Gift', 'Bonus', 'Other',
]
const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer',
  'UPI', 'Wallet', 'Cheque', 'Other',
]

const today = new Date().toISOString().split('T')[0]

export default function AddTransactionModal({ onClose, onSaved }) {
  const { user } = useAuth()

  const [type, setType]                   = useState('expense')
  const [amount, setAmount]               = useState('')
  const [category, setCategory]           = useState('')
  const [date, setDate]                   = useState(today)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description, setDescription]     = useState('')
  const [errors, setErrors]               = useState({})
  const [saving, setSaving]               = useState(false)
  const [success, setSuccess]             = useState(false)
  const [showDiscard, setShowDiscard]     = useState(false)

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  /* ── dirty check: has the user touched anything meaningful? ── */
  const isDirty =
    amount.trim() !== '' ||
    category !== '' ||
    paymentMethod !== '' ||
    description.trim() !== ''
  // note: date changing from today counts too
  // (but we default it to today so skip unless explicitly changed)

  /* ── backdrop click ───────────────────────────── */
  const handleBackdropClick = (e) => {
    if (e.target !== e.currentTarget) return
    if (isDirty) {
      setShowDiscard(true)   // show warning instead of closing
    } else {
      onClose()              // nothing entered → close freely
    }
  }

  /* ── validation ───────────────────────────────── */
  const validate = () => {
    const e = {}
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = 'Enter a valid amount.'
    if (!category)      e.category      = 'Required'
    if (!date)          e.date          = 'Required'
    if (!paymentMethod) e.paymentMethod = 'Required'
    return e
  }

  /* ── save ─────────────────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    setErrors({})
    const { error } = await supabase.from('transactions').insert([{
      user_id: user?.id, type,
      amount: parseFloat(Number(amount).toFixed(2)),
      category, date,
      payment_method: paymentMethod,
      description: description.trim() || null,
    }])
    setSaving(false)
    if (error) { setErrors({ submit: error.message || 'Something went wrong.' }); return }
    setSuccess(true)
    setTimeout(() => { onSaved?.(); onClose() }, 1500)
  }

  const handleTypeChange = (t) => {
    setType(t); setCategory('')
    setErrors((p) => ({ ...p, category: undefined }))
  }

  /* ── success state ────────────────────────────── */
  if (success) {
    return (
      <div className="atm-backdrop">
        <div className="atm-card atm-card--success">
          <div className="atm-success-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Saved!</h3>
          <p>Your transaction was recorded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="atm-backdrop" onClick={handleBackdropClick}>

      {/* ══════════════════════════════════════════
          Discard confirmation overlay (inside card)
          ══════════════════════════════════════════ */}
      {showDiscard && (
        <div className="atm-discard-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="atm-discard-box">
            <div className="atm-discard-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="atm-discard-title">Unsaved changes</h4>
            <p className="atm-discard-body">
              You have unsaved transaction data. What would you like to do?
            </p>
            <div className="atm-discard-actions">
              <button
                type="button"
                className="atm-discard-btn-keep"
                onClick={() => setShowDiscard(false)}
              >
                Keep Editing
              </button>
              <button
                type="button"
                className="atm-discard-btn-discard"
                onClick={onClose}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Main modal card
          ══════════════════════════════════════════ */}
      <div className="atm-card" onClick={(e) => e.stopPropagation()}>

        {/* Top bar */}
        <div className="atm-top">
          <div className="atm-type-pills" role="group">
            <button
              type="button"
              className={`atm-pill${type === 'expense' ? ' atm-pill--expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              <span className="atm-pill-dot atm-pill-dot--expense" />
              Expense
            </button>
            <button
              type="button"
              className={`atm-pill${type === 'income' ? ' atm-pill--income' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              <span className="atm-pill-dot atm-pill-dot--income" />
              Income
            </button>
          </div>
          <button
            type="button"
            className="atm-close"
            aria-label="Close"
            onClick={() => isDirty ? setShowDiscard(true) : onClose()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Amount hero */}
        <div className={`atm-amount-hero atm-amount-hero--${type}`}>
          <div className="atm-amount-label">
            {type === 'expense' ? 'You spent' : 'You earned'}
          </div>
          <div className="atm-amount-row">
            <span className="atm-amount-sign">{type === 'expense' ? '−' : '+'}</span>
            <span className="atm-amount-symbol">$</span>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="atm-amount-input"
              value={amount}
              autoFocus
              onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: undefined })) }}
            />
          </div>
          {errors.amount && <span className="atm-inline-err">{errors.amount}</span>}
        </div>

        {/* Fields */}
        <form className="atm-fields" onSubmit={handleSave} noValidate>
          <div className="atm-grid">
            {/* Category */}
            <div className={`atm-field${errors.category ? ' atm-field--err' : ''}`}>
              <label htmlFor="tx-category" className="atm-label">Category</label>
              <select
                id="tx-category"
                className="atm-select"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: undefined })) }}
              >
                <option value="" disabled>Select…</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="atm-ferr">{errors.category}</span>}
            </div>

            {/* Date */}
            <div className={`atm-field${errors.date ? ' atm-field--err' : ''}`}>
              <label htmlFor="tx-date" className="atm-label">Date</label>
              <input
                id="tx-date"
                type="date"
                className="atm-select"
                value={date}
                max={today}
                onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: undefined })) }}
              />
              {errors.date && <span className="atm-ferr">{errors.date}</span>}
            </div>

            {/* Payment method */}
            <div className={`atm-field atm-field--full${errors.paymentMethod ? ' atm-field--err' : ''}`}>
              <label className="atm-label">Payment Method</label>
              <div className="atm-method-pills">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`atm-method-pill${paymentMethod === m ? ' atm-method-pill--active' : ''}`}
                    onClick={() => { setPaymentMethod(m); setErrors((p) => ({ ...p, paymentMethod: undefined })) }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && <span className="atm-ferr">{errors.paymentMethod}</span>}
            </div>

            {/* Description */}
            <div className="atm-field atm-field--full">
              <label htmlFor="tx-desc" className="atm-label">
                Note <span className="atm-optional">(optional)</span>
              </label>
              <input
                id="tx-desc"
                type="text"
                className="atm-select"
                placeholder="What was this for?"
                maxLength={120}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {errors.submit && (
            <p className="atm-submit-err" role="alert">{errors.submit}</p>
          )}

          <div className="atm-actions">
            <button
              type="button"
              className="atm-btn-cancel"
              onClick={() => isDirty ? setShowDiscard(true) : onClose()}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" id="tx-save-btn" className="atm-btn-save" disabled={saving}>
              {saving ? <span className="atm-spinner" /> : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
