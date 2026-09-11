import { useMemo } from 'react'

const statusTheme = {
  Active: {
    chip: 'bg-[#e7fbf0] text-[#1e7d4d]',
    dot: 'bg-[#79e0b1]',
    halo: 'from-[#dff8ec] to-[#f8fff9]',
  },
  Prospect: {
    chip: 'bg-[#fff4df] text-[#8a5c14]',
    dot: 'bg-[#f1c14f]',
    halo: 'from-[#fff5db] to-[#fffaf1]',
  },
  Inactive: {
    chip: 'bg-[#f3f0ed] text-[#6f6863]',
    dot: 'bg-[#bdb7b1]',
    halo: 'from-[#f2efeb] to-[#f8f7f5]',
  },
}

export default function ClientDetailModal({ client, onClose, onEdit, onDelete, onCreateInvoice }) {
  const theme = statusTheme[client?.status] || statusTheme.Active

  const initials = useMemo(() => {
    return (client?.name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [client?.name])

  if (!client) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_22px_55px_rgba(17,17,17,0.16)]`}>
        <div className={`bg-gradient-to-br ${theme.halo} px-5 py-5 sm:px-6`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f0f0f] text-[14px] font-semibold text-white">
                {initials || 'CL'}
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#6a645e]">Client detail</p>
                <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#171514]">{client.name}</h2>
                <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${theme.chip}`}>
                  <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                  {client.status}
                </span>
              </div>
            </div>

            <button type="button" onClick={onClose} className="rounded-full bg-white/70 p-2 text-[#6a645e] ring-1 ring-[#e8e2dc] transition hover:bg-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-[20px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Company</span>
                  <strong className="mt-1 block text-[15px] text-[#1b1a19]">{client.company || 'Independent client'}</strong>
                </div>
                <div>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Project value</span>
                  <strong className="mt-1 block text-[15px] text-[#1b1a19]">{client.project_rate ? `₹${Number(client.project_rate).toLocaleString('en-IN')}` : '—'}</strong>
                </div>
                <div>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Email</span>
                  <strong className="mt-1 block text-[15px] text-[#1b1a19]">{client.email || 'No email'}</strong>
                </div>
                <div>
                  <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Phone</span>
                  <strong className="mt-1 block text-[15px] text-[#1b1a19]">{client.phone || 'No phone'}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
              <span className="block text-[12px] uppercase tracking-[0.12em] text-[#7a7672]">Notes</span>
              <p className="mt-2 text-[14px] leading-6 text-[#34302d]">{client.notes || 'No notes captured for this client yet.'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onCreateInvoice?.(client)}
              className="flex w-full items-center justify-between rounded-[18px] bg-[#79e0b1] px-4 py-4 text-left text-[14px] font-semibold text-[#0d0d0d] transition hover:brightness-95"
            >
              <span>Create invoice for this client</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5h7a2 2 0 0 1 2 2v10m-4 0H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(client)}
              className="w-full rounded-[18px] border border-[#e7e2dd] bg-white px-4 py-4 text-left text-[14px] font-medium text-[#1b1a19] transition hover:bg-[#f7f4f2]"
            >
              Edit client
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(client)}
              className="w-full rounded-[18px] border border-[#f5d6d6] bg-[#fff1f1] px-4 py-4 text-left text-[14px] font-medium text-[#c01f1f] transition hover:bg-[#ffe9e9]"
            >
              Delete client
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}