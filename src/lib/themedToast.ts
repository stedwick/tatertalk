import toast from "react-hot-toast"

const getStyle = () => {
  const theme = localStorage.getItem("theme")
  return theme === "dark"
    ? {
        background: "#333",
        color: "#fff",
      }
    : undefined
}

export const themedToastSuccess = (message: string) => {
  toast.success(message, {
    style: getStyle(),
  })
}

export const themedToastError = (errorMsg: string) => {
  toast.error(errorMsg, {
    style: getStyle(),
  })
}
