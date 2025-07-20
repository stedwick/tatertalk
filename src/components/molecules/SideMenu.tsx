import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import type React from "react"
import { useSupabase } from "../../hooks/useSupabase"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "danger"
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut, clearMessages } = useSupabase()

  const handleLogout = async () => {
    try {
      await signOut()
      clearMessages()
      onClose()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const menuItems: MenuItem[] = [
    {
      id: "user-info",
      label: user?.email || "User",
      icon: <UserIcon className="w-5 h-5" />,
      onClick: () => {
        console.log("User info clicked")
        onClose()
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      onClick: () => {
        console.log("Settings clicked")
        onClose()
      },
    },
    {
      id: "help",
      label: "Help",
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
      onClick: () => {
        window.open("https://youtu.be/47E8MYEPQrI", "_blank")
        onClose()
      },
    },
    {
      id: "about",
      label: "About",
      icon: <InformationCircleIcon className="w-5 h-5" />,
      onClick: () => {
        console.log("About clicked")
        onClose()
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5" />,
      onClick: handleLogout,
      variant: "danger",
    },
  ]

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
          if (e.key === "Escape") {
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
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      item.variant === "danger"
                        ? "hover:bg-error hover:text-error-content active:scale-95"
                        : "hover:bg-base-300 active:scale-95"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
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
