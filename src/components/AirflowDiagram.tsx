export type StepId = 'spray' | 'close' | 'place';

// Charcoal granules in the lower chamber (deterministic so SSR and client match).
const charcoal: { x: number; y: number; r: number }[] = [];
[240, 256, 272, 288].forEach((y, row) => {
  const half = Math.sqrt(100 * 100 - (y - 200) * (y - 200)) - 10;
  for (let x = 215 - half + (row % 2 ? 8 : 0); x <= 215 + half; x += 16) {
    const rx = Math.round(x);
    charcoal.push({ x: rx, y: y + ((rx * 7) % 5) - 2, r: 4 + ((rx + y) % 3) });
  }
});

const Arrow = ({ line, head }: { line: [number, number, number, number]; head: string }) => (
  <>
    <line x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} className="airflow__arrow" />
    <polygon points={head} className="airflow__arrowhead" />
  </>
);

/** Illustrative cutaway. The selected step highlights its part and dims the rest. */
export function AirflowDiagram({ step }: { step: StepId | null }) {
  return (
    <figure className="airflow card card--flat" data-step={step ?? undefined}>
      <svg viewBox="0 0 430 360" role="img" aria-labelledby="af-title af-desc" width="430" height="360">
        <title id="af-title">Cutaway of the scent ball</title>
        <desc id="af-desc">
          Air comes in through the side holes on the charcoal half, passes the activated charcoal, a divider with small
          holes and the scented lava stone, then leaves through the top holes.
        </desc>
        <circle cx="215" cy="70" r="16" fill="none" stroke="var(--ink)" strokeWidth="5" />
        <rect x="207" y="82" width="16" height="10" rx="3" fill="var(--ink)" />
        <circle cx="215" cy="200" r="112" fill="#fff" stroke="var(--ink)" strokeWidth="6" />

        <g className="part part--charcoal">
          {charcoal.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#33373b" />
          ))}
          <line x1="215" y1="300" x2="215" y2="326" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="215" y="348" textAnchor="middle" className="airflow__label">
            Charcoal chamber
          </text>
        </g>

        <g className="part part--divider">
          <path d="M109 216 Q215 242 321 216" className="airflow__divider" strokeDasharray="10 6" />
          <line x1="98" y1="200" x2="112" y2="200" className="airflow__divider" />
          <line x1="318" y1="200" x2="332" y2="200" className="airflow__divider" />
          <line x1="306" y1="222" x2="340" y2="222" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="344" y="227" className="airflow__label">
            Divider
          </text>
        </g>

        <g className="part part--lava">
          <path
            d="M171 152 C170 124 199 113 218 117 C244 121 261 136 257 160 C253 182 227 188 205 186 C183 184 172 172 171 152Z"
            className="airflow__lava"
          />
          <g fill="#5c463e">
            <circle cx="196" cy="140" r="4" />
            <circle cx="222" cy="134" r="3" />
            <circle cx="238" cy="160" r="4" />
            <circle cx="206" cy="168" r="3" />
            <circle cx="225" cy="152" r="2.5" />
          </g>
          <line x1="262" y1="150" x2="334" y2="146" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="338" y="141" className="airflow__label">
            Lava stone
          </text>
          <text x="338" y="159" className="airflow__label">
            chamber
          </text>
        </g>

        <g className="part part--holes">
          <g fill="var(--bg)">
            <circle cx="118" cy="256" r="6" />
            <circle cx="106" cy="229" r="6" />
            <circle cx="312" cy="256" r="6" />
            <circle cx="324" cy="229" r="6" />
            <circle cx="159" cy="103" r="6" />
            <circle cx="271" cy="103" r="6" />
          </g>
          <Arrow line={[28, 243, 86, 243]} head="96,243 84,236 84,250" />
          <Arrow line={[402, 243, 344, 243]} head="334,243 346,236 346,250" />
          <Arrow line={[152, 94, 134, 62]} head="129,52 140,58 127,64" />
          <Arrow line={[278, 94, 296, 62]} head="301,52 290,58 303,64" />
          <text x="20" y="30" className="airflow__label">
            Top holes: air out
          </text>
          <text x="20" y="276" className="airflow__label">
            Side holes:
          </text>
          <text x="20" y="294" className="airflow__label">
            air in
          </text>
        </g>
      </svg>
      <figcaption>Illustrative diagram</figcaption>
    </figure>
  );
}
