export default function Sidebar({
  items,
  activeItem,
  onSelect,
  onLogout,
  onSettings,
  mobileOpen,
  onMobileClose,
}) {
  const navButtons = (
    <>
      <nav className="flex flex-col items-center gap-3 pt-1" aria-label="Main navigation">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              activeItem === item.label
                ? 'bg-[#7de4b5] text-[#111111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]'
                : 'bg-white text-[#5f5a56] hover:bg-[#f6f4f2]'
            }`}
            onClick={() => onSelect(item.label)}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3 pb-1">
        <button
          type="button"
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#5f5a56] transition hover:bg-[#f6f4f2]"
          onClick={onSettings}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Logout"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#5f5a56] transition hover:bg-[#f6f4f2]"
          onClick={onLogout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="fixed left-6 top-28 bottom-6 z-40 hidden w-12 flex-col items-center justify-between md:flex">
        {navButtons}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/45" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#f5f3f1] p-4 shadow-[0_24px_60px_rgba(17,17,17,0.18)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-[#ece5e0]">
                  <img src="/WakeruCho-Logo.png" alt="WakeruCho" className="h-7 w-7 object-contain" />
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-[#7a7672]">Menu</p>
                  <strong className="text-[15px] text-[#171514]">WakeruCho</strong>
                </div>
              </div>
              <button type="button" aria-label="Close menu" className="rounded-full bg-white p-2 text-[#5f5a56] ring-1 ring-[#ece5e1]" onClick={onMobileClose}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex h-[calc(100%-72px)] flex-col justify-between">
              <div className="flex flex-col items-start gap-3">
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-label={item.label}
                    className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-all ${
                      activeItem === item.label
                        ? 'bg-[#7de4b5] text-[#111111]'
                        : 'bg-white text-[#5f5a56] hover:bg-[#f6f4f2]'
                    }`}
                    onClick={() => onSelect(item.label)}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">{item.icon}</span>
                    <span className="text-[14px] font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#e8e2dc] pt-4">
                <button type="button" className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 text-[14px] font-medium text-[#1b1a19] ring-1 ring-[#e7e2dd]" onClick={onSettings}>
                  Settings
                </button>
                <button type="button" className="flex flex-1 items-center gap-2 rounded-full bg-[#fff1f1] px-4 py-3 text-[14px] font-medium text-[#c01f1f] ring-1 ring-[#f5d6d6]" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
