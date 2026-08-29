import type { BodyZone, ZoneDecision } from "../domain/thermal.js";

export const ZONE_LABELS: Record<BodyZone, string> = {
  head_neck: "头颈",
  shoulder_back: "肩背",
  waist_abdomen: "腰腹",
  thigh: "大腿",
  knee_leg: "膝腿",
  foot: "足部"
};

export function userFacingPreference(decision: ZoneDecision): string {
  if (decision.action === "WARM") return "想暖一点";
  if (decision.action === "COOL") return "想凉一点";
  return "刚刚好";
}

interface BodyMapProps {
  decisions: readonly ZoneDecision[];
  selectedZone: BodyZone;
  onSelect: (zone: BodyZone) => void;
  compact?: boolean;
}

export function BodyMap({ decisions, selectedZone, onSelect, compact = false }: BodyMapProps) {
  return (
    <div className={`body-map${compact ? " body-map--compact" : ""}`}>
      <svg className="body-map__figure" viewBox="0 0 280 620" role="img" aria-label="六区身体轮廓">
        <path className="body-map__outline" d="M140 25c-28 0-48 22-48 51 0 24 13 42 30 49l-7 34-54 34c-15 10-25 27-26 45l-7 116c-1 19 9 34 25 39l27 8 9 91-8 104c-2 22 10 39 30 39 16 0 27-11 29-28l9-80 9 80c2 17 13 28 29 28 20 0 32-17 30-39l-8-104 9-91 27-8c16-5 26-20 25-39l-7-116c-1-18-11-35-26-45l-54-34-7-34c17-7 30-25 30-49 0-29-20-51-48-51Z" />
        <path className="body-map__seam" d="M92 188c33 18 63 18 96 0M83 272c38 15 76 15 114 0M82 365c39 13 77 13 116 0M89 463c33 9 69 9 102 0M84 555c36 8 76 8 112 0" />
      </svg>
      <ol className="body-map__zones" aria-label="选择身体区域">
        {decisions.map((decision) => (
          <li key={decision.zone} data-zone={decision.zone}>
            <button
              type="button"
              className={`zone-marker zone-marker--${decision.action.toLowerCase()}`}
              aria-pressed={selectedZone === decision.zone}
              onClick={() => onSelect(decision.zone)}
            >
              <span>{ZONE_LABELS[decision.zone]}</span>
              <strong>{userFacingPreference(decision)}</strong>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
