import React, { createContext, useContext, useState } from "react"
import CustomToast from "@/components/CustomToast"

type ToastType = "success" | "info" | "error"

interface ToastPayload {
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (payload: ToastPayload) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastPayload | null>(null)
  const [visible, setVisible] = useState(false)

  const showToast = (payload: ToastPayload) => {
    setToast(payload)
    setVisible(true)
  }

  const hideToast = () => {
    setVisible(false)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <CustomToast
          visible={visible}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
