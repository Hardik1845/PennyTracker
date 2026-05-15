import { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import PennyIndex from "./pages/Home";
import AnalyticsPage from "./pages/Analytics";
import TransactionsPage from "./pages/Transactions";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PennyIndex />,
  },
  {
    path:"/analytics",
    element: <AnalyticsPage/>
  },
  {
path:"/transactions",
element:<TransactionsPage/>
  }

])
function App() {
  
  return (
    <>
  
  <RouterProvider router ={router}></RouterProvider>
  
    </>
  )
  
}

export default App;