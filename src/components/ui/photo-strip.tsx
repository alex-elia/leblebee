export type PhotoStripProps = {
  photos: { id: string; alt: string; src?: string }[];
  onAddLabel?: string;
};

export function PhotoStrip({
  photos,
  onAddLabel = "Add photo",
}: PhotoStripProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <button
        type="button"
        className="tap-target flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-line bg-foam text-sm font-semibold text-olive"
      >
        {onAddLabel}
      </button>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-sand-deep"
        >
          {photo.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-xs text-ink-muted">
              {photo.alt}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
