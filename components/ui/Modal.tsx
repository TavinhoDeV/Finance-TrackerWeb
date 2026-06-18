"use client"
import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./Button"

interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode }

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1"><X className="w-5 h-5" /></Button>
        </div>
        {children}
      </div>
    </div>
  )
}
