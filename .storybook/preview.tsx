import React from "react"
import type { Decorator, Preview } from "@storybook/react-vite"

import "../styles/globals.css"

import { withThemeByClassName } from "@storybook/addon-themes"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils.ts"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export const decorators: Decorator = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
]

export default preview
