import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import DashboardPage from './components/DashboardPage'
import SendMoneyPage from './components/SendMoney'
import SigninPage from './components/SigninPage'
import SignupPage from './components/SignupPage'


function App() {

  return (
    <div>
        <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/signin' element={<SigninPage/>} />
          <Route path='/dashboard' element={<DashboardPage/>} />
          <Route path='/send' element={<SendMoneyPage/> } />
          <Route path='*' element={<SigninPage/>}  />
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
