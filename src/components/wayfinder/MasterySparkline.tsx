"use client";

import type { CSSProperties } from "react";

type MasterySparklineProps = {
  series: number[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
  title?: string;
};

/** Tiny SVG sparkline for mastery pass history (oldest → newest). */
export default function MasterySparkline({
  series,
  width = 64,
  height = 22,
  stroke = "#00CED1",
  className,
  title = "Mastery trend over the last 7 days",
}: MasterySparklineProps) {
  const values = series.length > 0 ? series : [0];
  const max = Math.max(...values, 1);
  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const points = values
    .map((value, index) => {
      const x =
        values.length === 1
          ? pad + innerW / 2
          : pad + (index / (values.length - 1)) * innerW;
      const y = pad + innerH - (value / max) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const style: CSSProperties = { display: "block" };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      {values.map((value, index) => {
        const x =
          values.length === 1
            ? pad + innerW / 2
            : pad + (index / (values.length - 1)) * innerW;
        const y = pad + innerH - (value / max) * innerH;
        return (
          <circle
            key={`${index}-${value}`}
            cx={x}
            cy={y}
            r={index === values.length - 1 ? 2.2 : 1.4}
            fill={stroke}
            opacity={index === values.length - 1 ? 1 : 0.55}
          />
        );
      })}
    </svg>
  );
}
