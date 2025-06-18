import { Switch } from "@radix-ui/react-switch"

import { Button } from "../ui/button"
import {
  GUIDE_COLORS,
  ToolbarPosition,
  ToolbarSettings,
  type ExtensionSettings,
} from "./toolbar-utils"

export interface Settings {
  extensionSettings: ExtensionSettings
  toolbarSettings: ToolbarSettings
}

export interface SettingsPanelProps {
  onSettingsChange?: (settings: Settings) => void
  settings?: Settings
  position?: ToolbarPosition
  setPosition?: (position: ToolbarPosition) => void
}

const SettingsPanel = ({ settings, position, setPosition }: SettingsPanelProps) => {
  return (
    <div>
      <h3 className="mb-2.5 text-base font-semibold">Inspector</h3>

      <div className="space-y-2">
        {/* Pin Options */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Pin options</span>
          <Switch checked={settings?.toolbarSettings.pinOptions} />
        </div>

        {/* Show Guide Lines */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Show guide lines</span>
          <Switch checked={settings?.extensionSettings.showGuideLines} />
        </div>

        {/* Guide Color */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Guide color</span>
          <div className="flex gap-2">
            {GUIDE_COLORS.map((color) => (
              <button
                key={color.value}
                className={`h-6 w-6 rounded-full ${color.class} border-2 transition-all ${
                  settings?.extensionSettings.guideColor === color.value
                    ? "scale-110 border-white"
                    : "border-slate-600 hover:border-slate-400"
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Show CSS Box */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Show css box</span>
          <Switch checked={settings?.extensionSettings.showCssBox} />
        </div>

        {/* Toolbar Position */}
        <div className="border-t pt-2">
          <span className="text-foreground mb-2 block text-sm">Toolbar Position</span>
          <div className="grid grid-cols-2 gap-2">
            {(["top-left", "top-right", "bottom-left", "bottom-right"] as ToolbarPosition[]).map(
              (pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition?.(pos)}
                  className={`rounded-lg px-3 py-2 text-xs transition-colors ${
                    position === pos
                      ? "bg-accent-9 text-accent-contrast"
                      : "bg-accent text-muted-foreground hover:bg-gray-5"
                  }`}
                >
                  {pos.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Edit Tailwind Config Button */}
      <Button className="bg-accent-9 text-accent-contrast hover:bg-accent-10 mt-6 w-full">
        Edit Tailwind Config
      </Button>
    </div>
  )
}

export { SettingsPanel }
