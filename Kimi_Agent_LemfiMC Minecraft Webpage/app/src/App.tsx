import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ContentEditorPage from './pages/ContentEditorPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/content" element={<ContentEditorPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
