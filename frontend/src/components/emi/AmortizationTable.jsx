export default function AmortizationTable({ schedule }) {
  return (
    <div className="max-h-96 overflow-auto rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md no-scrollbar">

      <table className="w-full text-sm text-left border-collapse">
        
        {/* FIXED HEADER */}
        <thead className="sticky top-0 bg-neutral-900/95 backdrop-blur-xl z-10 border-b border-white/10">
          <tr className="text-neutral-400 text-xs uppercase tracking-widest">
            <th className="px-6 py-4 font-semibold">Month</th>
            <th className="px-6 py-4 font-semibold">EMI</th>
            <th className="px-6 py-4 font-semibold">Principal</th>
            <th className="px-6 py-4 font-semibold">Interest</th>
            <th className="px-6 py-4 font-semibold">Balance</th>
          </tr>
        </thead>

        <tbody>
          {schedule.map((row) => (
            <tr
              key={row.month}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 text-white font-medium">{row.month}</td>
              <td className="px-6 py-4 font-bold text-white">₹ {row.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              <td className="px-6 py-4 text-cyan-400 font-medium">
                ₹ {row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td className="px-6 py-4 text-purple-400 font-medium">
                ₹ {row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td className="px-6 py-4 text-neutral-400">
                ₹ {row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}