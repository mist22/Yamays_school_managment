import React from 'react'
import  {Routes, Route} from "react-router-dom"
import Home from './Components/Home'
import AuthGate from './Components/AuthGate'
import Login from './Components/Login'


const App = () => {
  return (
    <Routes>
      <Route path='/'  element={<AuthGate/>}/>
      <Route path='/Home'  element={<Home/>}/>
      <Route path='/Login'  element={<Login/>}/>
    </Routes>
  )
}

export default App