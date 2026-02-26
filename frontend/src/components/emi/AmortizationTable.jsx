// src/components/emi/AmortizationTable.jsx

export default function AmortizationTable({ schedule }) {
  return (
    <div className="max-h-80 overflow-auto rounded-2xl border border-white/10 bg-black/40">

      <table className="w-full text-sm text-left border-collapse">
        
        {/* FIXED HEADER */}
        <thead className="sticky top-0 bg-black/95 backdrop-blur-md z-10">
          <tr className="text-cyan-400">
            <th className="px-4 py-3 font-semibold">Month</th>
            <th className="px-4 py-3 font-semibold">EMI</th>
            <th className="px-4 py-3 font-semibold">Principal</th>
            <th className="px-4 py-3 font-semibold">Interest</th>
            <th className="px-4 py-3 font-semibold">Balance</th>
          </tr>
        </thead>

        <tbody>
          {schedule.map((row) => (
            <tr
              key={row.month}
              className="border-t border-white/5 hover:bg-white/5 transition"
            >
              <td className="px-4 py-3">{row.month}</td>
              <td className="px-4 py-3">₹ {row.emi.toFixed(0)}</td>
              <td className="px-4 py-3 text-cyan-300">
                ₹ {row.principal.toFixed(0)}
              </td>
              <td className="px-4 py-3 text-orange-300">
                ₹ {row.interest.toFixed(0)}
              </td>
              <td className="px-4 py-3 text-neutral-300">
                ₹ {row.balance.toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}