import { Route, Routes } from 'react-router'
import './App.css'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/map' element={<MapPage />}/>
      </Routes>

    </>
  )
}

export default App
