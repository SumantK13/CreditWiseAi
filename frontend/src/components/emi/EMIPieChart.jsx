import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Updated to match the AI Dashboard vibe
const COLORS = {
  principal: "#06b6d4", // cyan-500
  interest: "#a855f7",  // purple-500
};

export default function EMIPieChart({ principal, interest }) {
  const data = [
    { name: "Principal", value: principal, color: COLORS.principal },
    { name: "Interest", value: interest, color: COLORS.interest },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];

    return (
      <div className="px-4 py-3 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 shadow-xl">
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: item.payload.color }}>
          {item.name}
        </span>
        <div className="text-lg font-bold text-white mt-1">
          ₹ {Number(item.value).toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              innerRadius={65}
              paddingAngle={5}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* PREMIUM LEGEND */}
      <div className="flex justify-center gap-8 mt-6 text-sm font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
          Principal
        </div>
        <div className="flex items-center gap-2 text-purple-400">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
          Interest
        </div>
      </div>
    </div>
  );
}