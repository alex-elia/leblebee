export function HandoffGallery({
  photos,
}: {
  photos: { id: string; url: string | null; caption: string | null }[];
}) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No handoff photos yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="overflow-hidden rounded-[var(--radius-sm)] border border-line bg-sand-deep"
        >
          {photo.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.url}
              alt={photo.caption ?? "Handoff photo"}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-xs text-ink-muted">
              Unavailable
            </div>
          )}
          {photo.caption ? (
            <figcaption className="line-clamp-2 px-2 py-1 text-xs text-ink-muted">
              {photo.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
