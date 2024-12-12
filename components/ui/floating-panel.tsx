"use client"

import { ReactNode, RefObject, useEffect, useRef } from "react"
import { ChevronUp, Loader } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

type PopoverFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openChild?: ReactNode
  successChild?: ReactNode
  showSuccess: boolean
  width?: string
  height?: string
  showCloseButton?: boolean
  title: string
}

export function FloatingPanelRoot({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

export function FloatingPanelTrigger({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string
  title: string
}) {
  return (
    <button
      className={cn(
        "flex h-9 items-center border bg-white dark:bg-[#121212] px-3 text-sm font-medium outline-none",
        className
      )}
    >
      {children}
    </button>
  )
}

export function FloatingPanelContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden border border-zinc-950/10 bg-white shadow-lg outline-none dark:border-zinc-50/10 dark:bg-zinc-800",
        className
      )}
      style={{ borderRadius: 12 }}
    >
      {children}
    </div>
  )
}

export function FloatingPanelForm({
  children,
  onSubmit,
  className,
}: {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}) {
  return (
    <form
      className={cn("flex h-full flex-col", className)}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

export function FloatingPanelLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode
  htmlFor: string
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100",
        className
      )}
    >
      {children}
    </label>
  )
}

export function FloatingPanelTextarea({
  className,
  id,
  value,
  onChange,
}: {
  className?: string
  id?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <textarea
      id={id}
      className={cn(
        "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none",
        className
      )}
      autoFocus
      value={value}
      onChange={onChange}
    />
  )
}

export function FloatingPanelFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn("flex justify-between px-4 py-3", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export function FloatingPanelCloseButton({
  className,
}: {
  className?: string
}) {
  return (
    <motion.button
      type="button"
      className={cn("flex items-center", className)}
      aria-label="Close floating panel"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ChevronUp className="text-zinc-900 dark:text-zinc-100 h-4 w-4" />
    </motion.button>
  )
}

export function FloatingPanelSubmitButton({
  className,
  text = "Submit",
}: {
  className?: string
  text?: string
}) {
  return (
    <motion.button
      className={cn(
        "relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className
      )}
      type="submit"
      aria-label="Submit message"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  )
}

export function FloatingPanelButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700",
        className
      )}
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
} 