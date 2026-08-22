const growthBars = [35, 32, 42, 30, 58, 52, 61, 48, 72, 68, 74, 62]

const transactionRows = [
  { name: 'Dribbble Pro Business', date: 'Wed 10:28 AM', amount: '$57.52', category: 'Subscriptions', account: 'VISA', status: 'Success' },
  { name: 'Dribbble Pro Business', date: 'Wed 10:28 AM', amount: '$57.52', category: 'Subscriptions', account: 'VISA', status: 'Success' },
  { name: 'Dribbble Pro Business', date: 'Wed 10:28 AM', amount: '$57.52', category: 'Subscriptions', account: 'VISA', status: 'Success' },
]

const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
        <div className="rounded-[28px] bg-[#0c0c0c] p-5 text-white shadow-[0_20px_30px_rgba(0,0,0,0.12)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#f0f0f0]">Total Balance</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-[#d8f6e4] ring-1 ring-white/10" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mb-2 text-[13px] text-[#9a9a9a]">Current balance</p>
          <h2 className="text-[34px] font-semibold tracking-[-0.08em] text-white">$432,568.00</h2>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#131313] p-3 ring-1 ring-white/10">
            <div>
              <p className="text-[12px] text-[#8e8e8e]">Net Savings this month</p>
              <p className="mt-1 text-[20px] font-semibold text-[#dff7ea]">$29,400.00 USD</p>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b6f7bf] text-[#0b0b0b]" type="button" aria-label="Add">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#1b1b1b]">Income Trend</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff] text-[#3a3836] ring-1 ring-[#e7e2dd]" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 text-[12px] text-[#7a7572]">
            <span className="rounded-full bg-[#ece9e6] px-2 py-1">12h</span>
            <span className="rounded-full bg-[#ece9e6] px-2 py-1">24h</span>
            <span className="rounded-full bg-[#141414] px-2 py-1 text-[#f6f6f6]">1 Week</span>
            <span className="rounded-full bg-[#ece9e6] px-2 py-1">1 Month</span>
          </div>

          <div className="mb-3 text-[34px] font-semibold tracking-[-0.08em] text-[#171614]">187,252</div>

          <div className="h-10 overflow-hidden rounded-full bg-[#e6e3df] p-1">
            <div className="h-full w-[72%] rounded-full bg-[#7be8bf]" />
          </div>

          <div className="mt-3 flex items-center justify-between text-[12px] text-[#6f6a66]">
            <span>Checking Total</span>
            <span className="font-medium text-[#0d0d0d]">+124 Today</span>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#1b1b1b]">Activity</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff] text-[#3a3836] ring-1 ring-[#e7e2dd]" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex h-28 items-end justify-between gap-2 pt-4">
            {growthBars.map((value, i) => (
              <div key={i} className="flex flex-1 items-end justify-center">
                <div
                  className={`${value > 60 ? 'bg-[#7be8bf]' : 'bg-[#dfe2df]'} w-full rounded-t-[10px]`}
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-[#6f6a66]">
            {weekLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1.2fr_1fr]">
        <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#1d1c1b]">Saved Money</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff] text-[#3a3836] ring-1 ring-[#e7e2dd]" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="text-[12px] text-[#726d6a]">Monitor how your money is being utilized</p>

          <div className="mt-4 flex gap-2 rounded-full bg-[#ece8e4] p-1 text-[12px] text-[#5f5a57]">
            {['Week', 'Month', 'Year'].map((option, index) => (
              <button
                key={option}
                type="button"
                className={`flex-1 rounded-full px-3 py-2 ${index === 1 ? 'bg-[#ffffff] text-[#131313] shadow-sm' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[13px] text-[#63605d]">Income</div>
              <div className="mt-2 text-[22px] font-semibold tracking-[-0.06em] text-[#171614]">$1,320.00</div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#5d5855]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#79d8a4]" />
                <span>Income</span>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#63605d]">Expenses</div>
              <div className="mt-2 text-[22px] font-semibold tracking-[-0.06em] text-[#171614]">$856.82</div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[#5d5855]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#dfe2df]" />
                <span>Expenses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#1b1b1b]">Total Income</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff] text-[#3a3836] ring-1 ring-[#e7e2dd]" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="text-[12px] text-[#726d6a]">View your income in a certain period of time</p>

          <div className="mt-5 h-44 rounded-[20px] bg-[#f7f6f5] p-3">
            <div className="flex h-full items-end gap-2">
              {[30, 50, 20, 40, 54, 44, 62, 65, 38, 50, 76, 58].map((value, index) => (
                <div key={index} className="flex-1 rounded-t-[10px] bg-[#dfe2df]" style={{ height: `${value}%` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#79e0b1] p-4 ring-1 ring-[#6ad2a0]">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[15px] font-medium text-[#1a1a1a]">Statistics</span>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff]/25 text-[#0d0d0d]" type="button" aria-label="Expand">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16 16 8M8 8h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="text-[18px] font-medium text-[#1a1a1a]">$147.48 <span className="text-[12px]">00</span></div>

          <div className="mt-8 h-24 rounded-[16px] bg-[#45d09a] p-3">
            <div className="flex h-full items-end gap-2">
              {[58, 48, 66, 52, 70, 65, 78, 74].map((value, index) => (
                <div key={index} className="flex-1 rounded-t-[9px] bg-[#d5f7e6]" style={{ height: `${value}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-[#f5f4f2] p-4 ring-1 ring-[#ece5e0]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[17px] font-semibold tracking-[-0.04em] text-[#1a1a1a]">Recent Transaction</h3>
          <div className="flex items-center gap-2 rounded-full bg-[#ece8e4] px-3 py-2 text-[12px] text-[#4a4542]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16l4 4" strokeLinecap="round" />
            </svg>
            Search
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[#e7e1dc] bg-[#f5f4f2]">
          <div className="grid grid-cols-[1.7fr_1fr_0.9fr_1.1fr_0.9fr_0.8fr] gap-3 bg-[#f1efed] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#69625d]">
            <span>Transaction</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Category</span>
            <span>Account</span>
            <span>Status</span>
          </div>

          {transactionRows.map((row, index) => (
            <div key={index} className="grid grid-cols-[1.7fr_1fr_0.9fr_1.1fr_0.9fr_0.8fr] items-center gap-3 border-t border-[#e7e1dc] px-4 py-4 text-[13px] text-[#2b2a2a]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ece8e4] text-[11px] font-semibold text-[#181715]">Be</div>
                <span className="font-medium text-[#1f1d1b]">{row.name}</span>
              </div>
              <span className="text-[#595451]">{row.date}</span>
              <span className="font-semibold text-[#1b1b1b]">{row.amount}</span>
              <span className="inline-flex items-center gap-2 text-[#494542]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8adcb0]" />
                {row.category}
              </span>
              <span className="text-[#4f4a47]">{row.account}</span>
              <span className="inline-flex justify-center rounded-full bg-[#d7f5e4] px-2.5 py-1 text-[11px] font-medium text-[#1e7d4d]">{row.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
