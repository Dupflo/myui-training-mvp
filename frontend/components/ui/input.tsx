import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  error?: { [key: string]: string[] }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <React.Fragment>
        <input
          type={type}
          className={cn(
            error ? "border-red-500 shadow-red-300" : "border-input",
            "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && props.name && (
          <p className="text-sm text-red-500">{error[props.name][0]}</p>
        )}
      </React.Fragment>
    )
  }
)
Input.displayName = "Input"

export { Input }
