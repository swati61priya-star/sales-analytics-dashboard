// Pastel placeholder "image" for a product: an emoji on a soft gradient tile.
export default function ProductTile({ emoji, color, size = 'h-12 w-12 text-2xl' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl ${size}`}
      style={{ background: `linear-gradient(135deg, ${color}99, ${color}33)` }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  )
}
