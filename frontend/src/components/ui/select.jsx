import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { 
          value, 
          onValueChange, 
          open, 
          setOpen 
        })
      )}
    </div>
  )
}

export function SelectTrigger({ className, children, value, onValueChange, open, setOpen, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <span>{value}</span>
      <span className="transform transition-transform">▼</span>
    </button>
  )
}

export function SelectValue({ placeholder = "Select..." }) {
  return <span>{placeholder}</span>
}

export function SelectContent({ children, value, onValueChange, open, setOpen }) {
  if (!open) return null

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
      <div className="p-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { 
            value, 
            onValueChange: (newValue) => {
              onValueChange(newValue)
              setOpen(false)
            }
          })
        )}
      </div>
    </div>
  )
}

export function SelectItem({ value: itemValue, children, onValueChange, value }) {
  const isSelected = value === itemValue
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-blue-100 text-blue-700"
      )}
      onClick={() => onValueChange(itemValue)}
    >
      {children}
    </div>
  )
}