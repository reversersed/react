import React, { useState } from 'react'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom"

import Navbar from './components/navbar/navbar.component'
import MoviePage from './components/moviepage/moviepage.component'
import Login from './components/login/login.component'
import Registration from './components/registration/registration.component'
import NotFound from './components/notfound/notfound.component'
import useToken from './components/useToken';
import Lab from './components/lab/lab.component'

function App() {
  const {isLogged, saveToken, removeToken} = useToken();

  return (
    <>
        {isLogged && (<Navbar removeSession={removeToken}/>)}
        <BrowserRouter>
          <Routes>
            {!isLogged && (<>
              <Route path="*" element={<Login setToken={saveToken}/>}/>
              <Route path="/signup" element={<Registration setToken={saveToken}/>}/>
            </>)}
            {isLogged && (<>
              <Route path="/" element={<MoviePage/>}/>
              <Route path="/lab" element={<Lab/>}/>
              <Route path="/lab/:id" element={<Lab/>}/>
            </>)}
            <Route path="/404" element={<NotFound/>}/>
            <Route path="*" element={<Navigate to='/404'/>}/>
          </Routes>
        </BrowserRouter>
        <Outlet/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)