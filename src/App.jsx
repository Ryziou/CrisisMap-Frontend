import { Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Map from './components/Map/Map'
import Home from './components/Home/Home'


function App() {


  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/map' element={<Map />}/>
    </Routes>
    </>
  )
}

export default App
