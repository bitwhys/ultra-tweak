import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"

import { BubbleEditor } from "@/components/bubble/editor.tsx"

const meta = {
  title: "UI/Bubble/Editor",
  component: BubbleEditor,
  parameters: {
    // layout: 'centered',
  },
  tags: ["autodocs"],
  argTypes: {},
  // args: { onClick: fn() },
} satisfies Meta<typeof BubbleEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
