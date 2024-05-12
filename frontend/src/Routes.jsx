import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import DashboardPage from './components/DashboardPage'
import SendMoneyPage from './components/SendMoney'
import SigninPage from './components/SigninPage'
import SignupPage from './components/SignupPage'
import { useAuthContext } from './context/AuthContext'
import TransactionsPage from './components/TransactionsPage'

export default function Routes() {
    const {token} = useAuthContext();

    const publicRoutes = [
      {
        path: '/signup',
        element: <SignupPage />
      },
      {
        path: '/signin',
        element: <SigninPage />
      },
      {
        path: '/',
        element: <SignupPage />
      },
      {
        path: '*',
        element: <SignupPage />
      }
    ];

    const authenticatedRoutes = [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/send',
        element: <SendMoneyPage />
      },
      {
        path: '/transactions',
        element: <TransactionsPage />
      }
    ];

    const router = createBrowserRouter([
      ...publicRoutes, 
      ...authenticatedRoutes
    ]);

    return <RouterProvider router={router} />
  }