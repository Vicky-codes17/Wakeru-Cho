import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    label: "Overview",
    path: "/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M4 11.5 12 4l8 7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 9.5V19h12v-9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M8 7h9M8 12h9M8 17h5" strokeLinecap="round" />
        <path d="M5 7h.01M5 12h.01M5 17h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Categories",
    path: "/categories",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z"
          strokeLinejoin="round"
        />
        <path
          d="M11 4h6.5A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20H11V4Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Freelancing",
    path: "/freelancing",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M7 8.5A2.5 2.5 0 0 1 9.5 6h5A2.5 2.5 0 0 1 17 8.5v7A2.5 2.5 0 0 1 14.5 18h-5A2.5 2.5 0 0 1 7 15.5v-7Z" />
        <path d="M10 10h4M10 14h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/reports",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 18V9m7 9V5m7 13v-7" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, showSignOutConfirm, setShowSignOutConfirm } =
    useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeItem =
    navItems.find((item) => item.path === location.pathname)?.label ??
    "Overview";

  const handleSidebarSelect = (value) => {
    const selected = navItems.find((item) => item.label === value);
    if (selected) navigate(selected.path);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    setShowSignOutConfirm(true);
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    navigate("/settings");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Kathy Murphy";
  const initials = displayName.slice(0, 2).toUpperCase();
  const email = user?.email || "viki@email.com";

  const profileActions = [
    {
      label: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
          />
        </svg>
      ),
      onClick: handleSettings,
    },
    {
      label: "Edit Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
    },
    {
      label: "Dark Mode",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      ),
      trailing: (
        <span className="h-4 w-7 rounded-full bg-[#e8e0da] ring-1 ring-[#dad1c9] p-0.5">
          <span className="block h-3 w-3 rounded-full bg-[#ffffff] translate-x-0" />
        </span>
      ),
    },
    {
      label: "Currency",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

    return (
    <>
      <header className="fixed left-0 right-0 top-6 z-50">
        <div className="mx-auto mb-0 flex max-w-[1380px] items-center justify-between gap-4 rounded-[26px] bg-[#f5f3f1] px-4 py-3 ring-1 ring-[#ece5e0] shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffffff] ring-1 ring-[#ece5e0]">
              <img src="/WakeruCho-Logo.png" alt="WakeruCho" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#111111]">WakeruCho</span>
          </div>

          <div className="flex w-full max-w-[560px] items-center justify-center">
            <div className="flex w-full items-center gap-2 rounded-full bg-[#f0efed] px-4 py-2.5 text-[13px] text-[#5f5b58] ring-1 ring-[#ebe5e1]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="11" cy="11" r="6" />
                <path d="M16 16l4 4" strokeLinecap="round" />
              </svg>
              <span className="w-full">Search</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0efed] text-[#5f5b58] ring-1 ring-[#ebe5e1] transition hover:bg-[#e7e4e1]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
            </button>

            <div className="relative">
              <button type="button" onClick={() => setShowUserMenu((open) => !open)} className="flex items-center gap-2 rounded-full bg-[#f0efed] px-2 py-1.5 ring-1 ring-[#ebe5e1] transition hover:bg-[#e7e4e1]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f0f0f] text-[11px] font-semibold text-[#f7f7f7]">{initials}</div>
                <div className="flex items-center gap-2 text-left leading-none"><span className="text-[12px] font-semibold text-[#171514]">{displayName}</span></div>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5f5b58]" fill="none" stroke="currentColor" strokeWidth={1.9}><path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-[310px] overflow-hidden rounded-[18px] border border-[#e8e2dc] bg-[#ffffff] shadow-[0_18px_40px_rgba(17,17,17,0.12)]">
                  <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-[#e8e2dc] bg-white" />

                  <div className="flex items-center gap-3 border-b border-[#f0ece8] px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f0f0f] text-[11px] font-semibold text-[#f7f7f7]">{initials}</div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#171514]">{displayName}</div>
                      <div className="truncate text-[11px] text-[#7a7672]">{email}</div>
                    </div>
                  </div>

                  <div className="space-y-1 px-2 py-2">
                    {profileActions.map((action, index) => (
                      <button key={action.label} type="button" onClick={action.onClick || (() => setShowUserMenu(false))} className={`flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-left text-[13px] text-[#1b1a19] transition hover:bg-[#f7f4f2] ${index === profileActions.length - 1 ? "text-[#111111]" : ""}`}>
                        <span className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center text-[#3f3b39]">{action.icon}</span>
                          <span>{action.label}</span>
                        </span>
                        {action.trailing}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1380px] gap-4 pt-24 md:pt-28">
        <Sidebar
          items={navItems}
          activeItem={activeItem}
          onSelect={handleSidebarSelect}
          onLogout={handleLogout}
          onSettings={handleSettings}
        />

        <main className="flex-1 rounded-[30px] bg-[#f1f0ee] p-4 ring-1 ring-[#ece5e0] md:p-5 ml-20">
          <Outlet />
        </main>
      </div>

      {showSignOutConfirm && (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal-card">
            <h3>Are you sure you want to sign out?</h3>
            <p>You can sign back in anytime.</p>

            <div className="confirm-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-signout-button"
                onClick={async () => {
                  await signOut();
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
