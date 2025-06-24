import { useCallback } from "react"

import { useBubbleContext } from "@/lib/bubble-context.tsx"

export const useCategoryNavigation = () => {
  const { selectedCategory, setSelectedCategory } = useBubbleContext()

  const navigateToCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId)
      // Any side effects like analytics tracking
    },
    [setSelectedCategory]
  )

  return { selectedCategory, navigateToCategory }
}
