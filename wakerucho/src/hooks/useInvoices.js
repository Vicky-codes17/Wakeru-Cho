import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeItems(items = []) {
  return items
    .map((item) => {
      const description = item.description?.trim() || ''
      const quantity = toNumber(item.quantity || 0)
      const rate = toNumber(item.rate || 0)
      const amount = quantity * rate

      return {
        description,
        quantity,
        rate,
        amount,
      }
    })
    .filter((item) => item.description && item.quantity > 0 && item.rate >= 0)
}

function calculateTotals(items = [], taxRate = 0, discountAmount = 0) {
  const subtotal = items.reduce((sum, item) => sum + toNumber(item.amount), 0)
  const tax_amount = subtotal * (toNumber(taxRate) / 100)
  const discount_amount = Math.min(toNumber(discountAmount), subtotal + tax_amount)
  const total = subtotal + tax_amount - discount_amount

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax_amount: Number(tax_amount.toFixed(2)),
    discount_amount: Number(discount_amount.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

function generateInvoiceNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `INV-${stamp}-${suffix}`
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function normalizeInvoicePayload(payload) {
  const items = normalizeItems(payload.items)
  if (items.length === 0) {
    throw new Error('Add at least one valid invoice item')
  }

  const totals = calculateTotals(items, payload.tax_rate, payload.discount_amount)

  return {
    invoice: {
      client_id: payload.client_id,
      invoice_number: payload.invoice_number || generateInvoiceNumber(),
      issue_date: payload.issue_date || todayISO(),
      due_date: payload.due_date || todayISO(),
      status: payload.status || 'Draft',
      tax_rate: toNumber(payload.tax_rate || 0),
      notes: payload.notes?.trim() || null,
      paid_at: payload.paid_at || null,
      payment_method: payload.payment_method || null,
      ...totals,
    },
    items,
  }
}

export function useInvoices() {
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [needsAuth, setNeedsAuth] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const clientMap = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.id] = client
      return acc
    }, {})
  }, [clients])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (authLoading) {
        setLoading(false)
        return
      }

      if (!user) {
        setNeedsAuth(true)
        setInvoices([])
        setClients([])
        setLoading(false)
        return
      }

      setNeedsAuth(false)

      const [{ data: clientRows, error: clientsError }, { data: invoiceRows, error: invoicesError }] = await Promise.all([
        supabase.from('clients').select('id, name, company, email, phone, status').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      if (clientsError) throw clientsError
      if (invoicesError) throw invoicesError

      const invoiceIds = (invoiceRows || []).map((invoice) => invoice.id)
      let itemsByInvoice = {}

      if (invoiceIds.length > 0) {
        const { data: itemRows, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .in('invoice_id', invoiceIds)

        if (itemsError) throw itemsError

        itemsByInvoice = (itemRows || []).reduce((acc, item) => {
          if (!acc[item.invoice_id]) acc[item.invoice_id] = []
          acc[item.invoice_id].push(item)
          return acc
        }, {})
      }

      const enriched = (invoiceRows || []).map((invoice) => {
        const client = clientRows?.find((entry) => entry.id === invoice.client_id) || null
        const items = itemsByInvoice[invoice.id] || []
        const dueDate = invoice.due_date ? new Date(invoice.due_date) : null
        const isOverdue = invoice.status !== 'Paid' && dueDate && dueDate < new Date(todayISO())

        return {
          ...invoice,
          client,
          items,
          is_overdue: Boolean(isOverdue),
        }
      })

      setClients(clientRows || [])
      setInvoices(enriched)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function addInvoice(payload) {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('No user')

      const normalized = normalizeInvoicePayload(payload)
      const { data: invoiceRows, error: invoiceError } = await supabase
        .from('invoices')
        .insert([
          {
            user_id: user.id,
            ...normalized.invoice,
          },
        ])
        .select()

      if (invoiceError) throw invoiceError

      const invoiceRow = invoiceRows?.[0]
      const itemPayload = normalized.items.map((item) => ({
        invoice_id: invoiceRow.id,
        ...item,
      }))

      const { error: itemsError } = await supabase.from('invoice_items').insert(itemPayload)
      if (itemsError) throw itemsError

      fetchAll().catch((refreshError) => {
        console.error('Invoice saved, but list refresh failed', refreshError)
      })

      return invoiceRow
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateInvoice(id, payload) {
    setLoading(true)
    setError(null)

    try {
      const normalized = normalizeInvoicePayload(payload)
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update(normalized.invoice)
        .eq('id', id)

      if (invoiceError) throw invoiceError

      const { error: deleteItemsError } = await supabase.from('invoice_items').delete().eq('invoice_id', id)
      if (deleteItemsError) throw deleteItemsError

      const { error: insertItemsError } = await supabase.from('invoice_items').insert(
        normalized.items.map((item) => ({
          invoice_id: id,
          ...item,
        })),
      )

      if (insertItemsError) throw insertItemsError

      fetchAll().catch((refreshError) => {
        console.error('Invoice updated, but list refresh failed', refreshError)
      })

      return { id, ...normalized.invoice }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteInvoice(id) {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteItemsError } = await supabase.from('invoice_items').delete().eq('invoice_id', id)
      if (deleteItemsError) throw deleteItemsError

      const { error: invoiceError } = await supabase.from('invoices').delete().eq('id', id)
      if (invoiceError) throw invoiceError

      fetchAll().catch((refreshError) => {
        console.error('Invoice deleted, but list refresh failed', refreshError)
      })

      return { deleted: true }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function markAsPaid(id, { payment_method, paid_at } = {}) {
    setLoading(true)
    setError(null)

    try {
      const invoice = invoices.find((entry) => entry.id === id)
      if (!invoice) throw new Error('Invoice not found')

      const paidDate = paid_at || todayISO()
      const method = payment_method || 'Bank Transfer'

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: 'Paid', paid_at: paidDate, payment_method: method })
        .eq('id', id)

      if (invoiceError) throw invoiceError

      const { error: txError } = await supabase.from('transactions').insert([
        {
          user_id: user.id,
          type: 'income',
          amount: toNumber(invoice.total),
          category: 'Freelance',
          date: paidDate,
          payment_method: method,
          description: `Invoice ${invoice.invoice_number} payment`,
        },
      ])

      if (txError) throw txError

      fetchAll().catch((refreshError) => {
        console.error('Invoice marked paid, but list refresh failed', refreshError)
      })

      return { paid: true }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    invoices,
    clients,
    clientMap,
    loading,
    error,
    needsAuth,
    refresh: fetchAll,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
  }
}

export { calculateTotals, normalizeInvoicePayload }
export default useInvoices