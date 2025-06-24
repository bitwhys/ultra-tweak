import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { Toolbar } from "@/components/toolbar"

const meta = {
  title: "UI/Toolbar",
  component: Toolbar,
  parameters: {
    // layout: 'centered',
  },
  tags: ["autodocs"],
  argTypes: {},
  // args: { onClick: fn() },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const TopLeft: Story = {
  args: {
    location: "top-left",
  },
}

export const BottomRight: Story = {
  args: {
    location: "bottom-right",
  },
}
export const BottomLeft: Story = {
  args: {
    location: "bottom-left",
  },
}
