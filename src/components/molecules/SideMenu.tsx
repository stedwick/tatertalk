import {
  Cog6ToothIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import type React from "react"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const menuItems: MenuItem[] = [
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
        console.log("Help clicked")
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
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - transparent with blur effect */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose()
            }
          }}
        />
      )}

      {/* Menu */}
      <div className="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle cursor-pointer"
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
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
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
