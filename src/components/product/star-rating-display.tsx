import { Star, StarHalf } from "lucide-react"

interface StarRatingDisplayProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function StarRatingDisplay({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className = "",
}: StarRatingDisplayProps) {
  // Convert the rating to a visual representation
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size]

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${sizeClass} fill-yellow-500 text-yellow-500`} />
        ))}

        {/* Half star */}
        {hasHalfStar && <StarHalf className={`${sizeClass} fill-yellow-500 text-yellow-500`} />}

        {/* Empty stars */}
        {Array.from({ length: maxRating - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClass} text-gray-300 dark:text-gray-600`} />
        ))}
      </div>

      {showValue && (
        <span className="ml-1 text-sm font-medium text-amber-800 dark:text-amber-300">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
