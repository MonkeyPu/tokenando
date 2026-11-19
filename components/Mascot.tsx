import type { Look, Mood, Prop } from "@/lib/assistant";

// The mascot is drawn from a Look (shape, colours, eyes, accessory), so any look works with
// every animation. The animations live in globals.css and are driven by the mood class.

const INK = "#111";

// Where the face sits for each shape (all drawn in a 200 x 200 box).
const FACE = {
  blob: { ex: [78, 122], ey: 106, my: 130, top: 62 },
  robot: { ex: [80, 120], ey: 110, my: 128, top: 72 },
  cat: { ex: [76, 124], ey: 104, my: 136, top: 54 },
} as const;

// [x, y, width, height] of each arm.
const ARMS = {
  blob: { l: [24, 108, 22, 46], r: [154, 108, 22, 46] },
  robot: { l: [26, 112, 20, 44], r: [154, 112, 20, 44] },
  cat: { l: [44, 138, 18, 38], r: [138, 138, 18, 38] },
} as const;

const DEFAULT_PROP: Record<Mood, Prop> = {
  idle: "none",
  wave: "none",
  point: "none",
  think: "question",
  cheer: "sparkles",
  oops: "sweat",
  celebrate: "sparkles",
};

function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

const outline = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round" as const };

function Body({ look }: { look: Look }) {
  const b = look.body;
  const a = look.accent;
  if (look.shape === "robot") {
    return (
      <g>
        <line x1="100" y1="72" x2="100" y2="50" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="44" r="8" fill={a} {...outline} />
        <rect x="62" y="170" width="28" height="14" rx="6" fill={b} {...outline} />
        <rect x="110" y="170" width="28" height="14" rx="6" fill={b} {...outline} />
        <rect x="44" y="72" width="112" height="104" rx="26" fill={b} {...outline} />
        <rect x="60" y="88" width="80" height="58" rx="16" fill="#12202a" {...outline} />
        <circle cx="82" cy="160" r="5" fill={a} />
        <circle cx="100" cy="160" r="5" fill={a} />
        <circle cx="118" cy="160" r="5" fill={a} />
      </g>
    );
  }
  if (look.shape === "cat") {
    return (
      <g>
        <ellipse cx="72" cy="182" rx="18" ry="9" fill={b} {...outline} />
        <ellipse cx="128" cy="182" rx="18" ry="9" fill={b} {...outline} />
        <ellipse cx="100" cy="152" rx="46" ry="32" fill={b} {...outline} />
        <path d="M48 80 L52 36 L88 62 Z" fill={b} {...outline} />
        <path d="M152 80 L148 36 L112 62 Z" fill={b} {...outline} />
        <path d="M57 70 L59 50 L76 62 Z" fill={a} />
        <path d="M143 70 L141 50 L124 62 Z" fill={a} />
        <ellipse cx="100" cy="106" rx="64" ry="52" fill={b} {...outline} />
        <circle cx="62" cy="124" r="8" fill={a} opacity="0.6" />
        <circle cx="138" cy="124" r="8" fill={a} opacity="0.6" />
        <ellipse cx="100" cy="129" rx="20" ry="13" fill={a} opacity="0.8" />
        <path d="M94 119 L106 119 L100 126 Z" fill="#ff8fa3" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <g stroke={INK} strokeWidth="2.5" strokeLinecap="round">
          <line x1="64" y1="128" x2="40" y2="122" />
          <line x1="64" y1="134" x2="40" y2="138" />
          <line x1="136" y1="128" x2="160" y2="122" />
          <line x1="136" y1="134" x2="160" y2="138" />
        </g>
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="72" cy="180" rx="18" ry="9" fill={b} {...outline} />
      <ellipse cx="128" cy="180" rx="18" ry="9" fill={b} {...outline} />
      <path d="M100 62 C98 48 106 42 114 44" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="100" cy="120" rx="64" ry="60" fill={b} {...outline} />
      <ellipse cx="100" cy="142" rx="36" ry="26" fill={a} opacity="0.35" />
      <circle cx="64" cy="126" r="8" fill={a} opacity="0.6" />
      <circle cx="136" cy="126" r="8" fill={a} opacity="0.6" />
    </g>
  );
}

function Arm({ look, side }: { look: Look; side: "l" | "r" }) {
  const [x, y, w, h] = ARMS[look.shape][side];
  return (
    <g className={side === "l" ? "m-armL" : "m-armR"}>
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={look.body} {...outline} />
    </g>
  );
}

function Eyes({ look, mood, ink }: { look: Look; mood: Mood; ink: string }) {
  const f = FACE[look.shape];
  const happy = mood === "cheer" || mood === "celebrate";
  const px = mood === "think" ? -3 : 0;
  const py = mood === "think" ? -4 : 0;
  return (
    <g className={happy ? "" : "m-eyes"}>
      {f.ex.map((x, i) => {
        const y = f.ey;
        if (happy) {
          return <path key={x} d={`M${x - 9} ${y + 3} Q${x} ${y - 10} ${x + 9} ${y + 3}`} stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
        }
        return (
          <g key={x}>
            {look.eyes === "round" ? (
              <>
                <circle cx={x} cy={y} r="12" fill="#fff" stroke={INK} strokeWidth="3" />
                <circle cx={x + px} cy={y + py} r="5.5" fill={INK} />
              </>
            ) : (
              <>
                <ellipse cx={x + px} cy={y + py} rx="6" ry="8" fill={ink} />
                <circle cx={x + px + 2} cy={y + py - 3} r="2" fill="#fff" />
              </>
            )}
            {mood === "oops" && (
              <path
                d={i === 0 ? `M${x - 9} ${y - 14} L${x + 8} ${y - 20}` : `M${x - 8} ${y - 20} L${x + 9} ${y - 14}`}
                stroke={look.shape === "robot" ? ink : INK}
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

function Mouth({ look, mood, ink }: { look: Look; mood: Mood; ink: string }) {
  const y = FACE[look.shape].my;
  if (mood === "cheer" || mood === "celebrate" || mood === "wave") {
    return (
      <g>
        <path d={`M88 ${y - 2} Q100 ${y + 20} 112 ${y - 2} Z`} fill={ink} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <path d={`M94 ${y + 9} Q100 ${y + 4} 106 ${y + 9} Q100 ${y + 13} 94 ${y + 9} Z`} fill="#ff8fa3" />
      </g>
    );
  }
  if (mood === "think") return <path d={`M92 ${y + 3} L106 ${y + 1}`} stroke={ink} strokeWidth="4" strokeLinecap="round" />;
  if (mood === "oops") return <path d={`M90 ${y + 8} Q100 ${y - 3} 110 ${y + 8}`} stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
  return <path d={`M88 ${y} Q100 ${y + 9} 112 ${y}`} stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />;
}

function Accessory({ look }: { look: Look }) {
  const f = FACE[look.shape];
  const t = f.top;
  const a = look.accent;
  switch (look.accessory) {
    case "glasses":
      return (
        <g>
          {f.ex.map((x) => (
            <circle key={x} cx={x} cy={f.ey} r="15" fill="#fff" fillOpacity="0.25" stroke={INK} strokeWidth="4" />
          ))}
          <line x1={f.ex[0] + 15} y1={f.ey} x2={f.ex[1] - 15} y2={f.ey} stroke={INK} strokeWidth="4" />
        </g>
      );
    case "cap":
      return (
        <g>
          <path d={`M66 ${t + 12} Q100 ${t - 34} 134 ${t + 12} Z`} fill={a} {...outline} />
          <rect x="102" y={t + 4} width="58" height="10" rx="5" fill={a} {...outline} />
        </g>
      );
    case "crown":
      return <path d={`M80 ${t + 4} L80 ${t - 16} L90 ${t - 6} L100 ${t - 20} L110 ${t - 6} L120 ${t - 16} L120 ${t + 4} Z`} fill="#ffd54a" {...outline} />;
    case "bow":
      return (
        <g>
          <path d={`M124 ${t + 6} L104 ${t - 6} L104 ${t + 18} Z`} fill={a} {...outline} />
          <path d={`M124 ${t + 6} L144 ${t - 6} L144 ${t + 18} Z`} fill={a} {...outline} />
          <circle cx="124" cy={t + 6} r="6" fill={a} {...outline} />
        </g>
      );
    default:
      return null;
  }
}

const star = "M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z";

function PropArt({ prop }: { prop: Prop }) {
  switch (prop) {
    case "lightbulb":
      return (
        <g transform="translate(16 4)"><g className="m-prop m-bulb">
          <g stroke="#ffe066" strokeWidth="3" strokeLinecap="round">
            <line x1="156" y1="16" x2="156" y2="10" />
            <line x1="136" y1="24" x2="131" y2="19" />
            <line x1="176" y1="24" x2="181" y2="19" />
          </g>
          <circle cx="156" cy="40" r="13" fill="#ffe066" stroke={INK} strokeWidth="3" />
          <rect x="150" y="52" width="12" height="9" rx="3" fill="#bbb" stroke={INK} strokeWidth="3" />
        </g></g>
      );
    case "question":
      return (
        <g transform="translate(14 -4)"><text className="m-prop m-q" x="156" y="58" fontSize="46" fontWeight="800" textAnchor="middle" fill="#ffe066" stroke={INK} strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
          ?
        </text></g>
      );
    case "book":
      return (
        <g className="m-prop">
          <path d="M100 150 L60 144 L60 178 L100 184 Z" fill="#fff" {...outline} />
          <path d="M100 150 L140 144 L140 178 L100 184 Z" fill="#fff" {...outline} />
          <g stroke="#999" strokeWidth="2" strokeLinecap="round">
            <line x1="68" y1="154" x2="92" y2="158" />
            <line x1="68" y1="162" x2="92" y2="166" />
            <line x1="132" y1="154" x2="108" y2="158" />
            <line x1="132" y1="162" x2="108" y2="166" />
          </g>
        </g>
      );
    case "sparkles":
      return (
        <g fill="#ffe066" stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path className="m-prop m-tw1" d={star} transform="translate(34 58)" />
          <path className="m-prop m-tw2" d={star} transform="translate(168 48)" />
          <path className="m-prop m-tw3" d={star} transform="translate(176 100)" />
        </g>
      );
    case "sweat":
      return <path className="m-prop m-drip" d="M152 62 C145 75 145 84 152 84 C159 84 159 75 152 62 Z" fill="#7fd4ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
    default:
      return null;
  }
}

const CONFETTI = ["#7AFB6A", "#ffe066", "#ff7a7a", "#6ec6ff", "#c9a7ff", "#ffb454"];

function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} style={{ ["--x" as string]: `${(i * 37) % 100}%`, ["--c" as string]: CONFETTI[i % CONFETTI.length], ["--d" as string]: `${(i % 6) * 0.25}s`, ["--t" as string]: `${1.6 + (i % 4) * 0.3}s` }} />
      ))}
    </div>
  );
}

type Props = { look: Look; mood?: Mood; prop?: Prop; size?: number };

export default function Mascot({ look, mood = "idle", prop, size = 140 }: Props) {
  const ink = look.shape === "robot" ? (lum(look.accent) > 0.5 ? look.accent : "#e8fff0") : INK;
  const shownProp = prop ?? DEFAULT_PROP[mood];
  return (
    <div className="mascot" style={{ width: size, height: size }} aria-hidden>
      <div key={mood} className={`mascot-pop mood-${mood}`}>
        <svg viewBox="0 0 200 200">
          <ellipse className="m-shadow" cx="100" cy="188" rx="48" ry="7" fill="#000" opacity="0.18" />
          <g className="m-all">
            {look.shape === "cat" && (
              <g className="m-tail">
                <path d="M150 152 C186 154 190 112 172 102" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
                <path d="M150 152 C186 154 190 112 172 102" fill="none" stroke={look.body} strokeWidth="12" strokeLinecap="round" />
              </g>
            )}
            <Body look={look} />
            <Arm look={look} side="l" />
            <Arm look={look} side="r" />
            <Eyes look={look} mood={mood} ink={ink} />
            <Mouth look={look} mood={mood} ink={ink} />
            <Accessory look={look} />
            <PropArt prop={shownProp} />
          </g>
        </svg>
        {mood === "celebrate" && <Confetti />}
      </div>
    </div>
  );
}
