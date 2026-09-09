import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

function normalizeClientPayload(payload) {
  return {
    name: payload.name?.trim() || '',
    company: payload.company?.trim() || '',
    email: payload.email?.trim() || '',
    phone: payload.phone?.trim() || '',
    status: payload.status || 'active',
    project_rate: payload.project_rate ? Number(payload.project_rate) : null,
    notes: payload.notes?.trim() || '',
  }
}

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [needsAuth, setNeedsAuth] = useState(false)
  const { user, loading: authLoading } = useAuth()

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
        setClients([])
        setLoading(false)
        return
      }

      setNeedsAuth(false)

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setClients(data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function addClient(payload) {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('No user')

      const normalized = normalizeClientPayload(payload)
      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([
          {
            user_id: user.id,
            ...normalized,
          },
        ])
        .select()

      if (insertError) throw insertError

      fetchAll().catch((refreshError) => {
        console.error('Client saved, but list refresh failed', refreshError)
      })
      return data?.[0]
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateClient(id, payload) {
    setLoading(true)
    setError(null)

    try {
      const normalized = normalizeClientPayload(payload)
      const { data, error: updateError } = await supabase
        .from('clients')
        .update(normalized)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      fetchAll().catch((refreshError) => {
        console.error('Client updated, but list refresh failed', refreshError)
      })
      return data?.[0]
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteClient(id) {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase.from('clients').delete().eq('id', id)

      if (deleteError) throw deleteError

      fetchAll().catch((refreshError) => {
        console.error('Client deleted, but list refresh failed', refreshError)
      })
      return { deleted: true }
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    clients,
    loading,
    error,
    needsAuth,
    refresh: fetchAll,
    addClient,
    updateClient,
    deleteClient,
  }
}

export default useClients