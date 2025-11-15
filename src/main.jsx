import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import FactCheckerPage from './FactChecker.jsx'

const router=createBrowserRouter([
  {path:"login",element:<Login/>},
  {path:"signup",element:<Signup/>},
  {path:"chat", element:<App/>},
  {path:"factchecker", element:<FactCheckerPage/>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
