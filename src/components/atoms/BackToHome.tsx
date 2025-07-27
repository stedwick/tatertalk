import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { Link } from "react-router"

export const BackToHome = ({ className }: { className?: string }) => {
  return (
    <Link
      to="/"
      className={clsx("link flex flex-row items-center gap-2", className)}
      aria-label="Back to Home"
    >
      <ArrowLeftIcon className="w-4 h-4" /> Back to Home
    </Link>
  )
}
