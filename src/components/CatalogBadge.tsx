/**
 * CatalogBadge — renders the "No. 0XX" catalog-number label.
 *
 * NUMBERING NOTE (intentional dual system):
 * Page-level "Card No." labels (000 = About, 001 = Home, 002 = Stories Index)
 * are a SEPARATE sequence from story-level catalog numbers (014+).
 * The gap implies ~13 stories exist from before the site launched.
 * Do NOT merge these into one unified sequence — the gap is intentional
 * worldbuilding detail.
 */
export default function CatalogBadge({ no }: { no: string | number }) {
  const display = typeof no === "number" ? String(no).padStart(3, "0") : no;

  return (
    <span className="font-ui text-[11px] tracking-wider text-ink-muted">
      No. {display}
    </span>
  );
}
