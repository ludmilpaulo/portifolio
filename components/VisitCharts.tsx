export interface VisitPoint {
  date: string;
  views: number;
  visitors: number;
}

export interface CountryStat {
  code: string;
  name: string;
  views: number;
  visitors: number;
}

function flagEmoji(code: string): string {
  if (!/^[a-z]{2}$/i.test(code)) return "🌐";
  const points = [...code.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...points);
}

function formatDay(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function VisitAreaChart({ series }: { series: VisitPoint[] }) {
  const hasViews = series.some((point) => point.views > 0);
  if (!hasViews) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Visits appear here after someone opens the public site.
      </p>
    );
  }

  const width = 640;
  const height = 220;
  const padX = 28;
  const padY = 24;
  const maxViews = Math.max(1, ...series.map((point) => point.views));
  const step = series.length <= 1 ? 0 : (width - padX * 2) / (series.length - 1);
  const points = series.map((point, index) => {
    const x = padX + index * step;
    const y = height - padY - (point.views / maxViews) * (height - padY * 2);
    return { ...point, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const last = points[points.length - 1];
  const area = `${padX},${height - padY} ${line} ${last.x},${height - padY}`;
  const labelIndexes = new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Daily page views">
      <polygon points={area} fill="rgba(0, 147, 233, 0.16)" />
      <polyline points={line} fill="none" stroke="#0093E9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {points.filter((_, index) => labelIndexes.has(index)).map((point) => (
        <text key={point.date} x={point.x} y={height - 6} textAnchor="middle" fontSize="11" fill="#64748b">
          {formatDay(point.date)}
        </text>
      ))}
    </svg>
  );
}

export function CountryBars({ countries, totalViews }: { countries: CountryStat[]; totalViews: number }) {
  if (countries.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Countries appear after the first tracked visit.
      </p>
    );
  }
  const denominator = Math.max(totalViews, 1);
  return (
    <ul className="space-y-3">
      {countries.map((country) => {
        const share = Math.round((country.views / denominator) * 100);
        return (
          <li key={`${country.code}-${country.name}`}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-800">
                <span className="mr-2" aria-hidden="true">{flagEmoji(country.code)}</span>
                {country.name}
              </span>
              <span className="text-slate-500">
                {country.views.toLocaleString()} views · {country.visitors.toLocaleString()} visitors
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0093E9] to-cyan-400" style={{ width: `${Math.max(share, 4)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
