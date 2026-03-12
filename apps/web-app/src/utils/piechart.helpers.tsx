/*eslint-disable @typescript-eslint/no-explicit-any */

export const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
  "#14B8A6"
];

export const renderInsideLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}: any) => {

  const RADIAN = Math.PI / 180;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};