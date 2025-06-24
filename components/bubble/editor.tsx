import React, { useEffect, useState } from "react"
import {
  Baby,
  Box,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  EyeOff,
  Grid3X3,
  History,
  Info,
  Layout,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  MousePointer,
  Palette,
  Plus,
  Redo2,
  RotateCcw,
  Search,
  Settings,
  BracketsIcon as Spacing,
  Sparkles,
  Star,
  Type,
  Undo2,
  Users,
  X,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils.ts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface BubbleEditorProps {
  element?: {
    tagName: string
    parentTag?: string
    classes: string[]
  }
  onClassAdd?: (className: string) => void
  onClassRemove?: (className: string) => void
  onClose?: () => void
}

// Organized category system
const CATEGORY_GROUPS = {
  structure: {
    name: "Structure",
    icon: Layout,
    categories: [
      { id: "children", name: "Children", icon: Baby },
      { id: "layout", name: "Layout", icon: Layout },
      { id: "flex-grid", name: "Flex & Grid", icon: Grid3X3 },
      { id: "spacing", name: "Spacing", icon: Spacing },
    ],
  },
  typography: {
    name: "Typography",
    icon: Type,
    categories: [{ id: "typography", name: "Typography", icon: Type }],
  },
  visual: {
    name: "Visual",
    icon: Palette,
    categories: [
      { id: "background", name: "Background", icon: Palette },
      { id: "border", name: "Border", icon: Box },
      { id: "effect", name: "Effect", icon: Sparkles },
    ],
  },
  animation: {
    name: "Animation",
    icon: RotateCcw,
    categories: [
      { id: "transform", name: "Transform", icon: RotateCcw },
      { id: "transition", name: "Transition", icon: Clock },
    ],
  },
  interaction: {
    name: "Interaction",
    icon: MousePointer,
    categories: [{ id: "interactivity", name: "Interactivity", icon: MousePointer }],
  },
}

const LAYOUT_PROPERTIES = [
  {
    name: "display",
    value: "flex",
    prefix: "",
    category: "layout",
    options: [
      { value: "block", label: "block" },
      { value: "inline-block", label: "inline-block" },
      { value: "flex", label: "flex" },
      { value: "inline-flex", label: "inline-flex" },
      { value: "grid", label: "grid" },
      { value: "hidden", label: "hidden" },
    ],
  },
  {
    name: "overflow",
    value: "visible",
    prefix: "overflow",
    category: "layout",
    options: [
      { value: "visible", label: "visible" },
      { value: "hidden", label: "hidden" },
      { value: "scroll", label: "scroll" },
      { value: "auto", label: "auto" },
    ],
  },
  {
    name: "position",
    value: "static",
    prefix: "",
    category: "layout",
    options: [
      { value: "static", label: "static" },
      { value: "relative", label: "relative" },
      { value: "absolute", label: "absolute" },
      { value: "fixed", label: "fixed" },
      { value: "sticky", label: "sticky" },
    ],
  },
]

const FLEX_PROPERTIES = [
  {
    name: "justify-content",
    value: "start",
    prefix: "justify",
    category: "flex-grid",
    options: [
      { value: "start", label: "start" },
      { value: "center", label: "center" },
      { value: "end", label: "end" },
      { value: "between", label: "between" },
      { value: "around", label: "around" },
      { value: "evenly", label: "evenly" },
    ],
  },
  {
    name: "align-items",
    value: "stretch",
    prefix: "items",
    category: "flex-grid",
    options: [
      { value: "start", label: "start" },
      { value: "center", label: "center" },
      { value: "end", label: "end" },
      { value: "stretch", label: "stretch" },
      { value: "baseline", label: "baseline" },
    ],
  },
]

const TYPOGRAPHY_PROPERTIES = [
  {
    name: "font-size",
    value: "base",
    prefix: "text",
    category: "typography",
    options: [
      { value: "xs", label: "xs", description: "12px" },
      { value: "sm", label: "sm", description: "14px" },
      { value: "base", label: "base", description: "16px" },
      { value: "lg", label: "lg", description: "18px" },
      { value: "xl", label: "xl", description: "20px" },
      { value: "2xl", label: "2xl", description: "24px" },
    ],
  },
  {
    name: "font-weight",
    value: "normal",
    prefix: "font",
    category: "typography",
    options: [
      { value: "thin", label: "thin" },
      { value: "light", label: "light" },
      { value: "normal", label: "normal" },
      { value: "medium", label: "medium" },
      { value: "semibold", label: "semibold" },
      { value: "bold", label: "bold" },
    ],
  },
]

const MIN_WIDTH_OPTIONS = [
  { value: "0", label: "0", description: "0px" },
  { value: "1", label: "1", description: "0.25rem" },
  { value: "2", label: "2", description: "0.5rem" },
  { value: "3", label: "3", description: "0.75rem" },
  { value: "4", label: "4", description: "1rem" },
  { value: "5", label: "5", description: "1.25rem" },
  { value: "6", label: "6", description: "1.5rem" },
  { value: "7", label: "7", description: "1.75rem" },
  { value: "8", label: "8", description: "2rem" },
]

const MOCK_HISTORY = [
  { id: 1, action: "Added bg-blue-500", time: "2 min ago", classes: ["bg-blue-500"] },
  { id: 2, action: "Removed p-4", time: "5 min ago", classes: ["p-4"] },
  { id: 3, action: "Added hover:scale-105", time: "8 min ago", classes: ["hover:scale-105"] },
]

const MOCK_PRESETS = [
  {
    name: "Button Primary",
    classes: ["bg-blue-600", "hover:bg-blue-700", "text-white", "px-4", "py-2", "rounded"],
  },
  { name: "Card", classes: ["bg-white", "shadow-lg", "rounded-lg", "p-6", "border"] },
  { name: "Center Content", classes: ["flex", "items-center", "justify-center"] },
]

type DrawerType = "add-class" | "edit-property" | "edit-arbitrary" | null

// Drawer component used in both modes
const PropertyDrawer = ({
  activeDrawer,
  selectedProperty,
  showArbitrary,
  setShowArbitrary,
  showImportant,
  setShowImportant,
  isPinned,
  setIsPinned,
  arbitraryValue,
  setArbitraryValue,
  handleArbitrarySave,
  handleOptionSelect,
  closeDrawer,
  newClass,
  setNewClass,
  handleAddClass,
}) => {
  if (!activeDrawer) return null

  return (
    <>
      <div className="absolute inset-0 z-10 bg-black/20" onClick={closeDrawer} />

      {activeDrawer === "add-class" && (
        <div className="animate-in slide-in-from-bottom bg-gray-2 absolute right-0 bottom-0 left-0 z-20 border-t border-slate-600 duration-200">
          <div className="p-4">
            <Input
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Enter classname"
              className="mb-4 border-slate-600 bg-slate-700 text-slate-200 placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddClass()
                if (e.key === "Escape") closeDrawer()
              }}
              autoFocus
            />
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Info className="h-4 w-4" />
              <span>You can separate multiple classes with space</span>
            </div>
            <Button
              onClick={handleAddClass}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Add class
            </Button>
          </div>
        </div>
      )}

      {activeDrawer === "edit-property" && selectedProperty && (
        <div className="animate-in slide-in-from-bottom bg-gray-2 absolute right-0 bottom-0 left-0 z-20 border-t border-slate-600 duration-200">
          <div className="p-4">
            {/* Variant Tabs */}
            <div className="mb-4 flex gap-1">
              <button className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
                default
              </button>
              <button className="rounded bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-600">
                +
              </button>
            </div>

            {/* Property Header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-slate-300">
                {selectedProperty.prefix || selectedProperty.name}-
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowArbitrary(!showArbitrary)}
                  className={`rounded px-2 py-1 text-xs ${
                    showArbitrary ? "bg-slate-600 text-slate-200" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  [..]
                </button>
                <button
                  onClick={() => setShowImportant(!showImportant)}
                  className={`rounded px-2 py-1 text-xs ${
                    showImportant ? "bg-slate-600 text-slate-200" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  !
                </button>
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`rounded px-2 py-1 text-xs ${
                    isPinned ? "bg-slate-600 text-slate-200" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {isPinned ? "unpin" : "pin"}
                </button>
              </div>
            </div>

            {/* Arbitrary Input */}
            {showArbitrary ? (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={arbitraryValue}
                    onChange={(e) => setArbitraryValue(e.target.value)}
                    placeholder="Custom value"
                    className="border-slate-600 bg-slate-700 pr-20 text-slate-200 placeholder:text-slate-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleArbitrarySave()
                    }}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded bg-slate-600 px-2 py-1 text-xs text-slate-300">
                    arbitrary
                  </span>
                </div>
                <Button
                  onClick={handleArbitrarySave}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </Button>
              </div>
            ) : (
              /* Options List */
              <ScrollArea className="h-64">
                <div className="space-y-1">
                  {(selectedProperty.name === "min-width"
                    ? MIN_WIDTH_OPTIONS
                    : selectedProperty.options
                  ).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option)}
                      className="flex w-full items-center justify-between rounded p-3 text-left transition-colors hover:bg-slate-700"
                    >
                      <span className="text-slate-200">{option.value || option.label}</span>
                      <span className="text-sm text-slate-500">{option.description}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Compact Mode Component
const CompactModeBubbleEditor = ({
  element,
  isDragging,
  currentPosition,
  handleMouseDown,
  toggleAdvancedMode,
  activeDrawer,
  setActiveDrawer,
  filteredClasses,
  handleRemoveClass,
  selectedCategoryGroup,
  getCurrentCategoryGroup,
  getCurrentCategories,
  handleCategoryGroupChange,
  selectedCategory,
  setSelectedCategory,
  getCurrentProperties,
  handlePropertyClick,
}) => {
  return (
    <div
      className={`bg-gray-2 relative z-50 flex h-[600px] w-80 flex-col overflow-hidden rounded-md border shadow-2xl transition-shadow ${isDragging ? "shadow-3xl ring-accent-9 ring-2" : ""}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle bg-gray-2 flex cursor-grab items-center justify-between border-b p-3 active:cursor-grabbing">
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          {element.parentTag && (
            <>
              <span className="capitalize">{element.parentTag}</span>
              <ChevronRight className="size-3" />
            </>
          )}
          <span className="text-foreground font-medium capitalize">{element.tagName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={toggleAdvancedMode}
            variant="ghost"
            size="sm"
            className="size-6 p-0"
            title="Advanced Mode"
          >
            <Maximize2 className="size-3" />
          </Button>
          <Button variant="ghost" size="sm" className="size-6 p-0">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="size-6 p-0">
            <MoreHorizontal className="size-3" />
          </Button>
        </div>
      </div>

      {/* Classes Display */}
      <div className="bg-gray-1 border-b p-2">
        <ScrollArea className="mb-3 h-40">
          <div className="flex min-h-[2rem] flex-wrap gap-1">
            {filteredClasses.map((className, index) => (
              <div
                key={index}
                className="group bg-gray-3 border-gray-7 text-muted-foreground hover:text-foreground hover:bg-gray-5 relative flex items-center gap-1 border border-dashed px-2 py-1 text-xs transition-colors"
              >
                <span>{className}</span>
                <button
                  onClick={() => handleRemoveClass(className)}
                  className="hover:text-danger-9 ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Add Class Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setActiveDrawer("add-class")}
            variant="ghost"
            size="sm"
            className="border-gray-7 text-muted-foreground hover:bg-gray-5 hover:text-foreground h-7 border border-dashed"
          >
            <Plus className="mr-1 h-3 w-3" />
            class
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground size-6 p-0"
          >
            <Copy className="size-3" />
          </Button>
        </div>
      </div>

      {/* Category Group Selector */}
      <div className="bg-gray-2 border-b p-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-full justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(getCurrentCategoryGroup().icon, { className: "w-4 h-4" })}
                <span>{getCurrentCategoryGroup().name}</span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} side="right" className="w-56">
            {Object.entries(CATEGORY_GROUPS).map(([groupId, group]) => {
              const Icon = group.icon
              return (
                <DropdownMenuItem
                  key={groupId}
                  onClick={() => handleCategoryGroupChange(groupId)}
                  className=""
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{group.name}</span>
                  {/*<span className="ml-auto text-xs text-slate-500">*/}
                  {/*  {" "}*/}
                  {/*  {group.categories.length === 1 ? "category" : "categories"}*/}
                  {/*</span>*/}
                  <DropdownMenuShortcut>{group.categories.length}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category Tabs */}
      <ScrollArea className="bg-gray-2 w-[calc(--spacing(80)-2px)] overflow-x-auto border-b">
        <div className="flex w-max">
          {getCurrentCategories().map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-gray-5 text-foreground border-accent-9 border-b-2"
                    : "text-gray-10 hover:bg-gray-4 hover:text-muted-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {category.name}
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Properties Grid */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex basis-36 flex-wrap gap-2">
            {getCurrentProperties().map((property) => (
              <button
                key={property.name}
                onClick={() => handlePropertyClick(property)}
                className={cn(
                  "bg-gray-4 hover:bg-gray-5 flex items-center justify-between gap-x-3 border px-3 py-2 text-xs transition-all"
                )}
              >
                <div className="text-gray-10 truncate lowercase">
                  {property.name.replace("-", " ")}
                </div>
                <div className="text-foreground truncate font-medium">{property.value}</div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Property Drawer */}
    </div>
  )
}

// Advanced Mode Component
const AdvancedModeBubbleEditor = ({
  element,
  isDragging,
  currentPosition,
  handleMouseDown,
  toggleAdvancedMode,
  activeDrawer,
  setActiveDrawer,
  filteredClasses,
  handleRemoveClass,
  classFilter,
  setClassFilter,
  selectedCategoryGroup,
  getCurrentCategoryGroup,
  getCurrentCategories,
  handleCategoryGroupChange,
  selectedCategory,
  setSelectedCategory,
  getCurrentProperties,
  handlePropertyClick,
  // Additional advanced mode props
  selectedElements,
  livePreview,
  setLivePreview,
  activeTab,
  setActiveTab,
  isQuickActionsCollapsed,
  setIsQuickActionsCollapsed,
  applyPreset,
}) => {
  return (
    <div
      className={`bg-gray-2 z-50 flex h-[600px] w-[800px] flex-col overflow-hidden border shadow-2xl transition-shadow ${isDragging ? "shadow-3xl ring-accent-9 ring-2" : ""}`}
      style={{
        left: Math.max(20, currentPosition.x - 250),
        top: currentPosition.y,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Advanced Header Toolbar */}
      <div className="drag-handle bg-gray-2 flex cursor-grab items-center justify-between border-b p-3 active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            {element.parentTag && (
              <>
                <span className="capitalize">{element.parentTag}</span>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="font-medium text-slate-200 capitalize">{element.tagName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {selectedElements.length} selected
          </Badge>
        </div>

        {/* Global Actions Toolbar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Undo2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Redo2 className="h-3 w-3" />
          </Button>
          <Separator orientation="vertical" className="h-4 bg-slate-600" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <History className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Users className="h-3 w-3" />
          </Button>
          <Separator orientation="vertical" className="h-4 bg-slate-600" />
          <Button
            onClick={() => setLivePreview(!livePreview)}
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${livePreview ? "text-green-400" : "text-slate-400"} hover:text-slate-200`}
          >
            {livePreview ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            onClick={toggleAdvancedMode}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
            title="Compact Mode"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="grid min-h-0 w-full flex-1 grid-cols-[auto_1fr_auto]">
        {/* Left Panel - Element Tree & Multi-Select */}
        <div className="bg-gray-1 flex w-56 flex-col border-r">
          <div
            className="border-b p-3"
            style={{ height: isQuickActionsCollapsed ? "calc(100% - 60px)" : "calc(100% - 140px)" }}
          >
            <h3 className="mb-2 text-sm font-medium text-slate-200">Element Tree</h3>
            <ScrollArea className="h-full overflow-hidden">
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 rounded bg-slate-700 p-2">
                  <input type="checkbox" className="h-3 w-3" checked readOnly />
                  <span className="text-slate-200">div.container</span>
                </div>
                <div className="ml-4 flex items-center gap-2 rounded p-2 hover:bg-slate-700">
                  <input type="checkbox" className="h-3 w-3" />
                  <span className="text-slate-300">div.flex</span>
                </div>
                <div className="ml-8 flex items-center gap-2 rounded p-2 hover:bg-slate-700">
                  <input type="checkbox" className="h-3 w-3" />
                  <span className="text-slate-300">button</span>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div
            className="p-3"
            style={{
              height: isQuickActionsCollapsed ? "60px" : "140px",
              transition: "height 0.2s ease-in-out",
            }}
          >
            <button
              onClick={() => setIsQuickActionsCollapsed(!isQuickActionsCollapsed)}
              className="mb-2 flex w-full items-center justify-between text-xs font-medium tracking-wide text-slate-400 uppercase transition-colors hover:text-slate-300"
            >
              <span>Quick Actions</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isQuickActionsCollapsed ? "-rotate-90" : ""}`}
              />
            </button>
            {!isQuickActionsCollapsed && (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-start text-slate-300"
                >
                  <Zap className="mr-2 h-3 w-3" />
                  Center Content
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-start text-slate-300"
                >
                  <Layout className="mr-2 h-3 w-3" />
                  Make Responsive
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-start text-slate-300"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Classes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Properties & Controls */}
        <div className="flex flex-1 flex-col">
          {/* Classes Display with Search */}
          <div className="bg-gray-1 border-b p-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-slate-500" />
                <Input
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  placeholder="Filter classes..."
                  className="h-7 border-slate-600 bg-slate-700 pl-7 text-sm text-slate-200"
                />
              </div>
              <Button
                onClick={() => setActiveDrawer("add-class")}
                size="sm"
                className="h-7 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>

            <ScrollArea className="h-20">
              <div className="flex min-h-[2rem] flex-wrap gap-1">
                {filteredClasses.map((className, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center gap-1 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-slate-200 transition-colors hover:bg-slate-600"
                  >
                    <span>{className}</span>
                    <button
                      onClick={() => handleRemoveClass(className)}
                      className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Category Group Navigation */}
          <div className="bg-gray-2 flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              {Object.entries(CATEGORY_GROUPS).map(([groupId, group]) => {
                const Icon = group.icon
                return (
                  <button
                    key={groupId}
                    onClick={() => handleCategoryGroupChange(groupId)}
                    className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategoryGroup === groupId
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {group.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="bg-gray-2 flex overflow-x-auto border-b">
            {getCurrentCategories().map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "border-b-2 border-indigo-500 bg-slate-700 text-slate-100"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {category.name}
                </button>
              )
            })}
          </div>

          {/* Properties Grid */}
          <ScrollArea className="flex-1">
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {getCurrentProperties().map((property) => (
                  <button
                    key={property.name}
                    onClick={() => handlePropertyClick(property)}
                    className="rounded-lg border border-slate-600 bg-slate-700 p-3 text-left transition-all hover:bg-slate-600"
                  >
                    <div className="mb-1 text-xs text-slate-400 lowercase">
                      {property.name.replace("-", " ")}
                    </div>
                    <div className="text-sm font-medium text-slate-200">{property.value}</div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Advanced Tools */}
        <div className="bg-gray-1 flex w-64 flex-col border-l">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {[
              { id: "properties", label: "Props", icon: Settings },
              { id: "history", label: "History", icon: History },
              { id: "presets", label: "Presets", icon: Star },
              { id: "performance", label: "Perf", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-1 items-center justify-center gap-1 p-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-500 bg-slate-700 text-slate-200"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1">
            <div className="p-3">
              {activeTab === "history" && (
                <div className="space-y-2">
                  <h4 className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Recent Changes
                  </h4>
                  {MOCK_HISTORY.map((item) => (
                    <div key={item.id} className="rounded bg-slate-700 p-2 text-sm">
                      <div className="font-medium text-slate-200">{item.action}</div>
                      <div className="text-xs text-slate-400">{item.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "presets" && (
                <div className="space-y-2">
                  <h4 className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Saved Presets
                  </h4>
                  {MOCK_PRESETS.map((preset, index) => (
                    <div key={index} className="rounded bg-slate-700 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">{preset.name}</span>
                        <Button
                          onClick={() => applyPreset(preset)}
                          size="sm"
                          className="h-6 bg-indigo-600 px-2 hover:bg-indigo-700"
                        >
                          Apply
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {preset.classes.slice(0, 3).map((className, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-600 px-1 py-0.5 text-xs text-slate-300"
                          >
                            {className}
                          </span>
                        ))}
                        {preset.classes.length > 3 && (
                          <span className="text-xs text-slate-400">
                            +{preset.classes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-3">
                  <h4 className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Bundle Impact
                  </h4>
                  <div className="rounded bg-slate-700 p-3">
                    <div className="mb-1 text-sm font-medium text-slate-200">CSS Size</div>
                    <div className="text-xs text-slate-400">+2.3KB from changes</div>
                  </div>
                  <div className="rounded bg-slate-700 p-3">
                    <div className="mb-1 text-sm font-medium text-slate-200">Unused Classes</div>
                    <div className="text-xs text-slate-400">3 classes can be removed</div>
                  </div>
                </div>
              )}

              {activeTab === "properties" && (
                <div className="space-y-3">
                  <h4 className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Element Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tag</span>
                      <span className="text-slate-200">{element.tagName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Classes</span>
                      <span className="text-slate-200">{element.classes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parent</span>
                      <span className="text-slate-200">{element.parentTag || "none"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* TODO: Property Drawer */}
    </div>
  )
}

// Main BubbleEditor Component
const BubbleEditor = ({
  element = {
    tagName: "div",
    parentTag: "div",
    classes: ["flex", "min-w-0", "flex-1", "flex-col"],
  },
  onClassAdd,
  onClassRemove,
  onClose,
}: BubbleEditorProps) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState("structure")
  const [selectedCategory, setSelectedCategory] = useState("layout")
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState("default")
  const [newClass, setNewClass] = useState("")
  const [arbitraryValue, setArbitraryValue] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [showArbitrary, setShowArbitrary] = useState(false)
  const [showImportant, setShowImportant] = useState(false)
  const [livePreview, setLivePreview] = useState(true)
  const [classFilter, setClassFilter] = useState("")
  const [selectedElements, setSelectedElements] = useState([element])
  const [activeTab, setActiveTab] = useState<"properties" | "history" | "presets" | "performance">(
    "properties"
  )
  const [isQuickActionsCollapsed, setIsQuickActionsCollapsed] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState({ x: 100, y: 100 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true)
      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - (isAdvancedMode ? 900 : 320), e.clientX - dragOffset.x)
      )
      const newY = Math.max(0, Math.min(window.innerHeight - 600, e.clientY - dragOffset.y))

      setCurrentPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add useEffect for global mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isDragging, dragOffset, isAdvancedMode])

  const handleAddClass = () => {
    if (newClass.trim()) {
      onClassAdd?.(newClass.trim())
      setNewClass("")
      setActiveDrawer(null)
    }
  }

  const handleRemoveClass = (className: string) => {
    onClassRemove?.(className)
  }

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property)
    setActiveDrawer("edit-property")
  }

  const handleOptionSelect = (option: any) => {
    const className = selectedProperty.prefix
      ? `${selectedProperty.prefix}-${option.value}`
      : option.value
    onClassAdd?.(className)
    if (!isPinned) {
      setActiveDrawer(null)
    }
  }

  const handleArbitrarySave = () => {
    if (arbitraryValue.trim() && selectedProperty) {
      const className = selectedProperty.prefix
        ? `${selectedProperty.prefix}-[${arbitraryValue.trim()}]`
        : `[${arbitraryValue.trim()}]`
      onClassAdd?.(className)
      setArbitraryValue("")
      setActiveDrawer(null)
    }
  }

  const closeDrawer = () => {
    setActiveDrawer(null)
    setSelectedProperty(null)
    setShowArbitrary(false)
  }

  const filteredClasses = element.classes.filter((className) =>
    className.toLowerCase().includes(classFilter.toLowerCase())
  )

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode)
    if (activeDrawer) {
      setActiveDrawer(null)
    }
  }

  const applyPreset = (preset: any) => {
    preset.classes.forEach((className: string) => {
      onClassAdd?.(className)
    })
  }

  const handleCategoryGroupChange = (groupId: string) => {
    setSelectedCategoryGroup(groupId)
    // Auto-select first category in the group
    const firstCategory = CATEGORY_GROUPS[groupId as keyof typeof CATEGORY_GROUPS].categories[0]
    setSelectedCategory(firstCategory.id)
  }

  const getCurrentProperties = () => {
    switch (selectedCategory) {
      case "layout":
        return LAYOUT_PROPERTIES
      case "flex-grid":
        return FLEX_PROPERTIES
      case "typography":
        return TYPOGRAPHY_PROPERTIES
      default:
        return LAYOUT_PROPERTIES
    }
  }

  const getCurrentCategoryGroup = () =>
    CATEGORY_GROUPS[selectedCategoryGroup as keyof typeof CATEGORY_GROUPS]
  const getCurrentCategories = () => getCurrentCategoryGroup().categories

  // Render the appropriate mode
  return isAdvancedMode ? (
    <AdvancedModeBubbleEditor
      element={element}
      isDragging={isDragging}
      currentPosition={currentPosition}
      handleMouseDown={handleMouseDown}
      toggleAdvancedMode={toggleAdvancedMode}
      activeDrawer={activeDrawer}
      setActiveDrawer={setActiveDrawer}
      filteredClasses={filteredClasses}
      handleRemoveClass={handleRemoveClass}
      classFilter={classFilter}
      setClassFilter={setClassFilter}
      selectedCategoryGroup={selectedCategoryGroup}
      getCurrentCategoryGroup={getCurrentCategoryGroup}
      getCurrentCategories={getCurrentCategories}
      handleCategoryGroupChange={handleCategoryGroupChange}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      getCurrentProperties={getCurrentProperties}
      handlePropertyClick={handlePropertyClick}
      selectedElements={selectedElements}
      livePreview={livePreview}
      setLivePreview={setLivePreview}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isQuickActionsCollapsed={isQuickActionsCollapsed}
      setIsQuickActionsCollapsed={setIsQuickActionsCollapsed}
      applyPreset={applyPreset}
      selectedProperty={selectedProperty}
      showArbitrary={showArbitrary}
      setShowArbitrary={setShowArbitrary}
      showImportant={showImportant}
      setShowImportant={setShowImportant}
      isPinned={isPinned}
      setIsPinned={setIsPinned}
      arbitraryValue={arbitraryValue}
      setArbitraryValue={setArbitraryValue}
      handleArbitrarySave={handleArbitrarySave}
      handleOptionSelect={handleOptionSelect}
      closeDrawer={closeDrawer}
      newClass={newClass}
      setNewClass={setNewClass}
      handleAddClass={handleAddClass}
    />
  ) : (
    <CompactModeBubbleEditor
      element={element}
      isDragging={isDragging}
      currentPosition={currentPosition}
      handleMouseDown={handleMouseDown}
      toggleAdvancedMode={toggleAdvancedMode}
      activeDrawer={activeDrawer}
      setActiveDrawer={setActiveDrawer}
      filteredClasses={filteredClasses}
      handleRemoveClass={handleRemoveClass}
      selectedCategoryGroup={selectedCategoryGroup}
      getCurrentCategoryGroup={getCurrentCategoryGroup}
      getCurrentCategories={getCurrentCategories}
      handleCategoryGroupChange={handleCategoryGroupChange}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      getCurrentProperties={getCurrentProperties}
      handlePropertyClick={handlePropertyClick}
      selectedProperty={selectedProperty}
      showArbitrary={showArbitrary}
      setShowArbitrary={setShowArbitrary}
      showImportant={showImportant}
      setShowImportant={setShowImportant}
      isPinned={isPinned}
      setIsPinned={setIsPinned}
      arbitraryValue={arbitraryValue}
      setArbitraryValue={setArbitraryValue}
      handleArbitrarySave={handleArbitrarySave}
      handleOptionSelect={handleOptionSelect}
      closeDrawer={closeDrawer}
      newClass={newClass}
      setNewClass={setNewClass}
      handleAddClass={handleAddClass}
    />
  )
}

export { BubbleEditor }
