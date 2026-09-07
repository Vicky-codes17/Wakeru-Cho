import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

function startOfMonthISO(d = new Date()) {
  const y = d.getFullYear()
  const m = d.getMonth()
  return new Date(y, m, 1).toISOString()
}

function endOfMonthISO(d = new Date()) {
  const y = d.getFullYear()
  const m = d.getMonth()
  return new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString()
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [needsAuth, setNeedsAuth] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (authLoading) {
        // auth still loading; bail out so effect can re-run
        setLoading(false)
        return
      }

      if (!user) {
        setNeedsAuth(true)
        setCategories([])
        setLoading(false)
        return
      }
      setNeedsAuth(false)

      // fetch categories
      const { data: cats, error: catsErr } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (catsErr) throw catsErr

      // fetch transactions for current month
      const start = startOfMonthISO()
      const end = endOfMonthISO()
      const { data: txs, error: txErr } = await supabase
        .from('transactions')
        .select('id, date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)

      if (txErr) throw txErr

      const txIds = (txs || []).map((t) => t.id)

      // fetch transaction_categories for those transactions
      let usageMap = {}
      if (txIds.length > 0) {
        const { data: tcs, error: tcErr } = await supabase
          .from('transaction_categories')
          .select('category_id, split_amount, transaction_id')
          .in('transaction_id', txIds)

        if (tcErr) throw tcErr

        usageMap = (tcs || []).reduce((acc, cur) => {
          const cid = cur.category_id
          acc[cid] = (acc[cid] || 0) + Number(cur.split_amount || 0)
          return acc
        }, {})
      }

      const enriched = (cats || []).map((c) => ({
        ...c,
        usage: usageMap[c.id] || 0,
      }))

      setCategories(enriched)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    fetchAll()
  }, [fetchAll, user, authLoading])

  async function addCategory({ name, type, budget_limit }) {
    setLoading(true)
    setError(null)
    try {
      if (!user) throw new Error('No user')

      const { data, error: insertErr } = await supabase
        .from('categories')
        .insert([
          {
            user_id: user.id,
            name,
            type,
            budget_limit: budget_limit || null,
          },
        ])
        .select()

      if (insertErr) throw insertErr
      await fetchAll()
      return data?.[0]
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateCategory(id, { name, budget_limit }) {
    setLoading(true)
    setError(null)
    try {
      const { data, error: upErr } = await supabase
        .from('categories')
        .update({ name, budget_limit: budget_limit || null })
        .eq('id', id)
        .select()

      if (upErr) throw upErr
      await fetchAll()
      return data?.[0]
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function getLinkedCount(categoryId) {
    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .select('transaction_id')
        .eq('category_id', categoryId)

      if (error) throw error
      return (data || []).length
    } catch (err) {
      setError(err)
      throw err
    }
  }

  async function deleteCategory(id) {
    setLoading(true)
    setError(null)
    try {
      const linked = await getLinkedCount(id)
      if (linked > 0) {
        // caller should confirm before calling delete; return linked count
      }

      const { error: delErr } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (delErr) throw delErr
      await fetchAll()
      return { deleted: true, linked }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    needsAuth,
    refresh: fetchAll,
    addCategory,
    updateCategory,
    deleteCategory,
    getLinkedCount,
  }
}

export default useCategories
