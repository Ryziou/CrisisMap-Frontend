import { Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Map from './components/Map/Map'
import Home from './components/Home/Home'
import Authenticate from './components/Authenticate/Authenticate'


function App() {


  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/map' element={<Map />}/>
      <Route path='/authenticate' element={<Authenticate />}/>
    </Routes>
    </>
  )
}

export default App
