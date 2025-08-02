import { Toaster } from "react-hot-toast"
import AuthPage from "./components/pages/AuthPage"
import MainPage from "./components/pages/MainPage"
import SettingsPage from "./components/pages/SettingsPage"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "./components/layout"
import LogoutPage from "./components/pages/LogoutPage"
import { SupabaseListener } from "./lib/SupabaseListener"

function App() {
  return (
    <>
      <Toaster />
      <SupabaseListener />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
