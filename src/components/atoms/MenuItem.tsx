import type React from "react"
import { NavLink } from "react-router"

export interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "default" | "danger"
  rightIcon?: React.ReactNode
  isExternal?: boolean
}

interface MenuItemProps {
  item: MenuItem
  onClose?: () => void
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, onClose }) => {
  if (item.href) {
    if (item.isExternal) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
            item.variant === "danger"
              ? "hover:bg-error hover:text-error-content active:scale-95"
              : "hover:bg-base-300 active:scale-95"
          }`}
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.rightIcon && item.rightIcon}
        </a>
      )
    } else {
      return (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            `w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-primary text-primary-content"
                : item.variant === "danger"
                  ? "hover:bg-error hover:text-error-content active:scale-95"
                  : "hover:bg-base-300 active:scale-95"
            }`
          }
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.rightIcon && item.rightIcon}
        </NavLink>
      )
    }
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
        item.variant === "danger"
          ? "hover:bg-error hover:text-error-content active:scale-95"
          : "hover:bg-base-300 active:scale-95"
      }`}
    >
      <div className="flex items-center gap-3">
        {item.icon}
        <span>{item.label}</span>
      </div>
      {item.rightIcon && item.rightIcon}
    </button>
  )
}

export default MenuItemComponent
