// src/components/emi/EMIPieChart.jsx

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  principal: "#06b6d4",
  interest: "#f97316",
};

export default function EMIPieChart({ principal, interest }) {
  const data = [
    { name: "Principal", value: principal, color: COLORS.principal },
    { name: "Interest", value: interest, color: COLORS.interest },
  ];

  // ⭐ PREMIUM CUSTOM TOOLTIP (fixes empty black space)
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0];

    return (
      <div className="px-4 py-2 rounded-xl bg-black/90 border border-white/10 shadow-lg">
        <span
          className="text-base font-semibold"
          style={{ color: item.payload.color }}
        >
          {item.name} : ₹ {Number(item.value).toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-6">

     
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            {/* CUSTOM TOOLTIP */}
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ⭐ PREMIUM LEGEND (LIKE YOUR IMAGE) */}
      <div className="flex justify-center gap-8 mt-4 text-xl font-semibold">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-4 h-4 rounded-full bg-cyan-500"></span>
          Principal
        </div>

        <div className="flex items-center gap-2 text-orange-400">
          <span className="w-4 h-4 rounded-full bg-orange-500"></span>
          Interest
        </div>
      </div>
    </div>
  );
}