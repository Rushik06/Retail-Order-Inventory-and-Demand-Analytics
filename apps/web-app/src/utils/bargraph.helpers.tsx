/*eslint-disable */
export const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;

  const value = payload.value;

  const short =
    value.length > 14 ? value.slice(0, 14) + "…" : value;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{value}</title>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        transform="rotate(-30)"
        fill="#334155"
        fontSize={13}
        fontWeight={500}
      >
        {short}
      </text>
    </g>
  );
};
