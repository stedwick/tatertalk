// import { useEffect } from "react"

import { Outlet } from "react-router"
import Header from "./atoms/Header"
import MountainBackground from "./atoms/MountainBackground"

export default function Layout() {
  return (
    // TODO: On mobile, the tab bar takes up space, and pushes TaterTalk down, so the buttons are off screen. Let's make the text area and main viewport take up the visible height, not the entire window height.
    <div className="min-h-dvh bg-base-100 flex flex-col">
      <MountainBackground className="fixed inset-0 z-0" />
      <div className="flex-1 px-4 py-6 pt-22 flex flex-col relative">
        <div className="flex-1 flex flex-col z-10 max-w-2xl w-full mx-auto">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
