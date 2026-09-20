import type { Forecast } from '@/domain'

export function ForecastChart({ forecast, observedValue, compact = false }: Readonly<{ forecast: Forecast; observedValue: number; compact?: boolean }>) {
  const values = [observedValue, ...forecast.points.map((point) => point.value)]
  const lower = [observedValue, ...forecast.points.map((point) => point.lowerBound)]
  const upper = [observedValue, ...forecast.points.map((point) => point.upperBound)]
  const all = [...lower, ...upper]
  const min = Math.min(...all) - 0.5
  const max = Math.max(...all) + 0.5
  const x = (index: number) => 52 + index * (500 / Math.max(values.length - 1, 1))
  const y = (value: number) => 185 - ((value - min) / Math.max(max - min, 1)) * 135
  const line = values.map((value, index) => `${x(index)},${y(value)}`).join(' ')
  const band = [...upper.map((value, index) => `${x(index)},${y(value)}`), ...lower.map((value, index) => `${x(lower.length - 1 - index)},${y(lower[lower.length - 1 - index]!)}`)].join(' ')
  const end = forecast.points.at(-1)?.value ?? observedValue
  const summary = `Price is modeled to rise from ${observedValue.toFixed(2)} to ${end.toFixed(2)} ${forecast.unitLabel} over ${forecast.horizonDays} days with ${forecast.confidence.band} model confidence.`

  return <figure className={compact ? 'mt-4' : 'mt-6'} aria-label="Observed and forecast price"><svg role="img" aria-labelledby="forecast-chart-title forecast-chart-description" viewBox="0 0 600 225" className="h-auto w-full"><title id="forecast-chart-title">Observed and forecast price</title><desc id="forecast-chart-description">{summary}</desc>{[0, 1, 2, 3].map((row) => <line key={row} x1="52" x2="552" y1={50 + row * 45} y2={50 + row * 45} stroke="var(--border)" strokeWidth="1" />)}<polygon points={band} fill="var(--forecast)" opacity="0.12" /><polyline points={line} fill="none" stroke="var(--forecast)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{values.map((value, index) => <circle key={`${value}-${index}`} cx={x(index)} cy={y(value)} r="4" fill={index === 0 ? 'var(--observed)' : 'var(--forecast)'} stroke="white" strokeWidth="2" />)}<text x="52" y="215" fontSize="11" fill="var(--muted-foreground)">Observed</text>{forecast.points.map((point, index) => <text key={point.date} x={x(index + 1)} y="215" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{new Date(point.date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}</text>)}</svg><figcaption className="sr-only">{summary}</figcaption></figure>
}
