import * as React from "react"
import { cn } from "@/lib/utils/cn"

interface DropdownMenuProps {
  children: React.ReactNode
}

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | undefined>(undefined)

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuTrigger = ({ children, className }: DropdownMenuTriggerProps) => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
}

const DropdownMenuContent = ({ children, className, align = "end" }: DropdownMenuContentProps) => {
  const context = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setOpen(false)
      }
    }

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context])

  if (!context.open) return null

  const alignmentClass = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align]

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        alignmentClass,
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const DropdownMenuItem = ({ children, onClick, className, disabled }: DropdownMenuItemProps) => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuItem must be used within DropdownMenu")

  const handleClick = () => {
    if (!disabled) {
      onClick?.()
      context.setOpen(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  )
}

interface DropdownMenuSeparatorProps {
  className?: string
}

const DropdownMenuSeparator = ({ className }: DropdownMenuSeparatorProps) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
