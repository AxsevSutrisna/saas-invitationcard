import * as React from "react"
import { cn } from "@/lib/utils"

export function GlassCard({
  className,
  children,
  variant = "card",
  ...props
}) {
  // Menggunakan style kartu biasa (solid) alih-alih glassmorphism
  const baseClass = "bg-[#36302B] border border-[#4A433A] rounded-3xl shadow-lg relative overflow-hidden"

  return (
    <div
      className={cn(baseClass, className)}
      {...props}
    >
      {children}
    </div>
  )
}
