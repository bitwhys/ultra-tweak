// contexts/BubbleContext.tsx
interface BubbleContextValue {
  // State
  element: ElementData
  activeDrawer: DrawerType | null
  selectedProperty: Property | null
  isAdvancedMode: boolean

  // Actions
  toggleMode: () => void
  openDrawer: (type: DrawerType, property?: Property) => void
  closeDrawer: () => void
  addClass: (className: string) => void
  removeClass: (className: string) => void

  // Computed values
  filteredClasses: string[]
  currentProperties: Property[]
  currentCategories: Category[]
}

const BubbleContext = createContext<BubbleContextValue>()

export const BubbleProvider = ({ children, element, onClassChange }) => {
  // All your state management logic here
  const [state, dispatch] = useReducer(bubbleReducer, initialState)

  // Business logic hooks
  const { handlePropertySelect, handleClassManagement } = useBubbleActions(state, dispatch)

  const value = useMemo(
    () => ({
      ...state,
      ...actions,
      // Computed values
      filteredClasses: element.classes.filter(/* filter logic */),
      currentProperties: getCurrentProperties(state.selectedCategory),
    }),
    [state, element]
  )

  return <BubbleContext.Provider value={value}>{children}</BubbleContext.Provider>
}

export const useBubbleContext = () => {
  const context = useContext(BubbleContext)
  if (!context) {
    throw new Error("useBubbleContext must be used within a BubbleProvider")
  }
  return context
}
