import "./chart.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#ef7b8b", "#7bc96f", "#6fa8dc", "#ffd966", "#c27ba0"];

export default function Chart({ expenses }) {

  // 🔹 Build category map
  const categoryMap = {};

  expenses.forEach((exp) => {
    const cat = exp.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
  });

  // 🔹 Convert to chart data
  const chartData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // 🔹 Currency format
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN").format(amt);

  return (
    <div className="chart-container">

      <h3 className="chart-title">Expense Breakdown</h3>

      {chartData.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <PieChart width={280} height={280}>

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"

            // clean labels (only %)
            label={({ percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => `₹ ${formatCurrency(value)}`}
          />

          <Legend verticalAlign="bottom" height={36} />

        </PieChart>
      )}

    </div>
  );
}