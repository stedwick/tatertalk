import type React from "react"

const LoadingPage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )
}

export default LoadingPage
