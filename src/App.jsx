import { Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Map from './components/Map/Map'


function App() {


  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/map' element={<Map />}/>
    </Routes>
    </>
  )
}

export default App
