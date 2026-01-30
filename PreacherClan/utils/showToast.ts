type ToastType = "success" | "info" | "error"

interface ToastPayload {
  type: ToastType
  title: string
  message?: string
}

let toastRef: ((payload: ToastPayload) => void) | null = null

export const registerToast = (fn: (payload: ToastPayload) => void) => {
  toastRef = fn
}

export const showToast = (payload: ToastPayload) => {
  toastRef?.(payload)
}
