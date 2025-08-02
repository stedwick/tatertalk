import {
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { PlayCircleIcon } from "@heroicons/react/24/solid"
import { useAtomValue } from "jotai"
import type React from "react"
import { useEffect } from "react"
import { userAtom } from "../../atoms/authAtoms"
import MenuItemComponent, { type MenuItem } from "../atoms/MenuItem"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const user = useAtomValue(userAtom)

  // Handle escape key globally when menu is open
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      href: "/settings",
    },
    {
      id: "help",
      label: "1-Minute Tutorial",
      icon: <PlayCircleIcon className="w-5 h-5" />,
      href: "https://youtu.be/47E8MYEPQrI",
      rightIcon: <ArrowTopRightOnSquareIcon className="w-4 h-4" />,
      isExternal: true,
    },
    {
      id: "about",
      label: "About",
      icon: <InformationCircleIcon className="w-5 h-5" />,
      href: "https://phils.app",
      rightIcon: <ArrowTopRightOnSquareIcon className="w-4 h-4" />,
      isExternal: true,
    },
  ]

  if (user) {
    menuItems.unshift({
      id: "user-info",
      label: user?.email || "User",
      icon: <UserIcon className="w-5 h-5" />,
      onClick: () => {
        console.log("User info clicked")
        onClose()
      },
    })
    menuItems.push({
      id: "logout",
      label: "Logout",
      icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5" />,
      href: "/logout",
      variant: "danger",
    })
  } else {
    menuItems.unshift({
      id: "login",
      label: "Signup / Login",
      icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5" />,
      href: "/login",
    })
  }

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        role="button"
        tabIndex={0}
        className={`fixed inset-0 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose()
          }
        }}
      />

      {/* Menu with slide animation */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-base-100 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle cursor-pointer hover:bg-base-300 transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <MenuItemComponent item={item} onClose={onClose} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
