
import { Routes, Route } from 'react-router-dom'
import Backtesting from './pages/backtesting'
import UploadData from './pages/uploaddata'
import Dashboard from './pages/dashboard'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/backtesting" element={<Backtesting />} />
        <Route path="/upload" element={<UploadData />} />
      </Routes>
    </div>
  )
}

export default App
