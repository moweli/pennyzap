import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Portfolio } from "@/types";
import { COLORS } from "@/utils";

interface CustomPieChartProps {
  data: Portfolio[];
  title: string;
}

interface LabelProps {
  name: string;
  value: number;
}

export const CustomPieChart = ({ data, title }: CustomPieChartProps) => {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }: LabelProps) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Allocation"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
