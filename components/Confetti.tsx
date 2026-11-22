const CONFETTI = ["#7AFB6A", "#ffe066", "#ff7a7a", "#6ec6ff", "#c9a7ff", "#ffb454"];

type Props = { once?: boolean; count?: number };

// `once` plays the fall a single time (a burst for a correct answer).
// Without it the confetti keeps looping, which is what the celebrate pose uses.
export default function Confetti({ once = false, count = 18 }: Props) {
  return (
    <div className={`confetti${once ? " once" : ""}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            ["--x" as string]: `${(i * 37) % 100}%`,
            ["--c" as string]: CONFETTI[i % CONFETTI.length],
            ["--d" as string]: `${(i % 6) * 0.25}s`,
            ["--t" as string]: `${1.6 + (i % 4) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
