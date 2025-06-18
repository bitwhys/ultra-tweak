import { Laptop, Monitor, Smartphone, Tablet, X } from "lucide-react"

export type ToolbarPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export type ActivePanel = "settings" | "breakpoints" | null

export const BREAKPOINTS = [
  { name: "iPhone 12 Pro", width: 390, icon: Smartphone },
  { name: "iPad Mini", width: 768, icon: Tablet },
  { name: "iPad Air", width: 820, icon: Tablet },
  { name: "Laptop", width: 1024, icon: Laptop },
  { name: "Laptop L", width: 1440, icon: Monitor },
  { name: "4K", width: 2560, icon: Monitor },
]

export const GUIDE_COLORS = [
  { name: "Green", value: "#10b981", class: "bg-green-9" },
  { name: "Red", value: "#ef4444", class: "bg-red-9" },
  { name: "Blue", value: "#3b82f6", class: "bg-blue-9" },
]

export interface ToolbarSettings {
  position: ToolbarPosition
  // TODO: this will be used to control the opacity of the toolbar. Possibly usefull for when you need to see some UI underneath the toolbar.
  visibility: number
  pinOptions: boolean
  rememberLastPosition: boolean
}

export interface ExtensionSettings {
  showGuideLines: boolean
  guideColor: string
  showCssBox: boolean
  tailwindConfigPath: string
  defaultView: 'quick' | 'advanced'
}
