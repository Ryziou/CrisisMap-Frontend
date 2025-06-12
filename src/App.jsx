import { Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Map from './components/Map/Map'
import Home from './components/Home/Home'
import Authenticate from './components/Authenticate/Authenticate'
import UserProfile from './components/UserProfile/UserProfile'
import UserProfileEdit from './components/UserProfileEdit/UserProfileEdit'
import Footer from './components/Footer/Footer'


function App() {


  return (
    <>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/map' element={<Map />} />
            <Route path='/authenticate' element={<Authenticate />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/profile/:userId' element={<UserProfile />} />
            <Route path='/profile/edit' element={<UserProfileEdit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
