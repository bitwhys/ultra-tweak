import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { cn } from "@/lib/utils"
import { SettingsPanel } from "@/components/toolbar/settings-panel"

const meta = {
  title: "UI/SettingsPanel",
  component: SettingsPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    (Story) => (
      // TODO: make this as clos to `<PopupContent/>` as possible
      <div
        className={cn(
          "animate-in slide-in-from-top-2 left-0 w-96 rounded-2xl border shadow-2xl duration-200",
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 border p-4 shadow-md outline-none"
        )}
      >
        <Story />
      </div>
    ),
  ],
  // args: { onClick: fn() },
} satisfies Meta<typeof SettingsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    settings: {
      extensionSettings: {
        showGuideLines: false,
        guideColor: "#10b981",
        showCssBox: false,
        tailwindConfigPath: "",
        defaultView: "quick",
      },
      toolbarSettings: {
        position: "top-left",
        visibility: 1,
        pinOptions: false,
        rememberLastPosition: false,
      },
    },
    onSettingsChange: fn(),
  },
}
