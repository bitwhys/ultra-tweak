import { useState } from "react"
import {
  CameraIcon,
  CursorClickIcon,
  CursorTextIcon,
  Devices,
  DevicesIcon,
  GearSixIcon,
  ScanIcon,
  XIcon,
} from "@phosphor-icons/react"
import * as ToolbarPrimitive from "@radix-ui/react-toolbar"

import { cn } from "@/lib/utils.ts"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"

import { SettingsPanel } from "./settings-panel"
import { BREAKPOINTS, GUIDE_COLORS } from "./toolbar-utils"
import type { ActivePanel, ToolbarPosition } from "./toolbar-utils"

export interface ToolbarProps {
  onClose?: () => void
  onOpenBubbleEditor?: () => void
}

const Toolbar = ({ onClose, onOpenBubbleEditor }: ToolbarProps) => {
  const [position, setPosition] = useState<ToolbarPosition>("top-left")
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [settings, setSettings] = useState({
    pinOptions: true,
    showGuideLines: true,
    guideColor: "#3b82f6",
    showCssBox: true,
  })

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      default:
        return "top-4 left-4"
    }
  }

  const getPanelPositionClasses = () => {
    const isRightSide = position.includes("right")
    const isBottomSide = position.includes("bottom")

    let classes = ""

    // Vertical positioning
    if (isBottomSide) {
      classes += "bottom-full mb-2 "
    } else {
      classes += "top-full mt-2 "
    }

    // Horizontal anchoring
    if (isRightSide) {
      classes += "right-0"
    } else {
      classes += "left-0"
    }

    return classes
  }

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const handleBreakpointSelect = (width: number) => {
    // In a real implementation, this would resize the viewport or preview
    console.log(`Setting viewport width to ${width}px`)
    setActivePanel(null)
  }

  const handleGuideColorChange = (color: string) => {
    setSettings((prev) => ({ ...prev, guideColor: color }))
  }

  return (
    <ToolbarPrimitive.Root
      className={cn(
        "bg-gray-1 border-gray-7 fixed z-50 flex items-center gap-1 rounded-xl border p-1.5 shadow-xl",
        getPositionClasses()
      )}
    >
      {/* Left Section */}
      <ToolbarPrimitive.ToolbarToggleGroup
        defaultValue="inspect-elements"
        type="single"
        className="flex items-center gap-1 pr-1.5"
      >
        <ToolbarPrimitive.ToggleItem asChild value="interact" className="">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
            title="Browse Site Normally"
          >
            <CursorClickIcon weight="bold" className="size-5" />
          </Button>
        </ToolbarPrimitive.ToggleItem>

        <ToolbarPrimitive.ToggleItem asChild value="inspect-elements" className="">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
            title="Inspect Elements"
          >
            <ScanIcon weight="bold" className="size-5" />
          </Button>
        </ToolbarPrimitive.ToggleItem>

        <ToolbarPrimitive.ToggleItem asChild value="edit-content" className="">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
            title="Edit Content"
          >
            <CursorTextIcon weight="bold" className="size-5" />
          </Button>
        </ToolbarPrimitive.ToggleItem>
      </ToolbarPrimitive.ToolbarToggleGroup>
      <ToolbarPrimitive.Separator className="h-6 w-px bg-slate-600" />
      {/* Right Section */}
      <ToolbarPrimitive.ToolbarToggleGroup type="single" className="flex items-center gap-1 pl-1.5">
        <ToolbarPrimitive.ToggleItem asChild value="capture-screenshot" className="">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
            title="Capture Screenshot"
          >
            <CameraIcon weight="bold" className="size-5" />
          </Button>
        </ToolbarPrimitive.ToggleItem>

        <DropdownMenu>
          <ToolbarPrimitive.ToggleItem asChild value="adjust-viewport">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
                  title="Adjust Viewport"
                >
                  <DevicesIcon weight="bold" className="size-5" />
                </Button>
              </DropdownMenuTrigger>
            </ToolbarPrimitive.ToggleItem>
          <DropdownMenuContent
            sideOffset={20}
            className="animate-in slide-in-from-top-2 left-0 rounded-xl border shadow-xl duration-200"
          >
            <div className="space-y-1">
              {BREAKPOINTS.map((breakpoint) => {
                const Icon = breakpoint.icon
                return (
                  <DropdownMenuItem key={breakpoint.name} className="">
                    <div className="flex items-center gap-3">
                      <Icon className="text-gray-10 group-hover:text-primary size-5" />
                      <span className="text-muted-foreground group-hover:text-primary">
                        {breakpoint.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary font-mono text-sm">
                      {breakpoint.width}
                    </span>
                  </DropdownMenuItem>
                )
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <ToolbarPrimitive.ToggleItem asChild value="extension-settings">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
                title="Edit Extension Settings"
              >
                <GearSixIcon weight="bold" className="size-5" />
              </Button>
            </ToolbarPrimitive.ToggleItem>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={20}
            className="animate-in slide-in-from-top-2 left-0 rounded-xl border shadow-xl duration-200"
          >
            <SettingsPanel />
          </PopoverContent>
        </Popover>

        <ToolbarPrimitive.ToggleItem asChild value="exit-extension" className="">
          <Button
            onClick={onOpenBubbleEditor}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-gray-5 hover:text-gray-12 data-on:bg-accent-9 data-on:text-accent-contrast size-8 p-0"
            title="Exit Extension"
          >
            <XIcon weight="bold" className="size-5" />
          </Button>
        </ToolbarPrimitive.ToggleItem>
      </ToolbarPrimitive.ToolbarToggleGroup>
    </ToolbarPrimitive.Root>
  )
}

export { Toolbar }
