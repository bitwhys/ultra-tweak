import * as React from "react"

export const useDragBehavior = (isAdvancedMode: boolean) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Drag logic here
  }, [])

  return { isDragging, position, handleMouseDown }
}
