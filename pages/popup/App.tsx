import { useState } from "react"
import reactLogo from "@/assets/react.svg"
import { Moon } from "lucide-react"

import wxtLogo from "/wxt.svg"

import "./App.css"

import { Button } from "@/components/ui/button.tsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="relative">
      <Button size="icon" className="size-8 rounded-full">
        <Moon className="mr-2 h-4 w-4" />
      </Button>
      <div>
        <a>
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the WXT and React logos to learn more</p>
    </div>
  )
}

export default App
