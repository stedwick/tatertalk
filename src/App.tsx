import AuthPage from "./components/pages/AuthPage"
import MainPage from "./components/pages/MainPage"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "./components/layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
