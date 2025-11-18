import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <label className="relative inline-block w-11 h-6">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <span
            className={cn(
              "absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors",
              "peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "before:content-[''] before:absolute before:h-5 before:w-5 before:left-0.5 before:top-0.5",
              "before:bg-white before:rounded-full before:transition-transform",
              "peer-checked:before:translate-x-5",
              className
            )}
          />
        </label>
        {label && (
          <label className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
