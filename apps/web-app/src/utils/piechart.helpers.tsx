/*eslint-disable @typescript-eslint/no-explicit-any */

export const COLORS = [
  "#1014d2",
  "#e40fd6",
  "#17f803",
  "#ee1414",
  "#06B6D4",
  "#f0ec16",
  "#067669"
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