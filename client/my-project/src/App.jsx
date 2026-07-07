import { useState } from "react";
import axios from "axios";
import { BrowserRouter,Route, Routes ,Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PennyIndex from "./pages/Home";
import AnalyticsPage from "./pages/Analytics";
import TransactionsPage from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <PennyIndex />,
//   },
//   {
//     path:"/analytics",
//     element: <AnalyticsPage/>
//   },
//   {
// path:"/transactions",
// element:<TransactionsPage/>
//   },
//   {
//     path:"/budget",
//     element:<Budgets/>
//   }

// ])
function App() {
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element= {<PennyIndex />}></Route>
    <Route path="/analytics" element= {<AnalyticsPage/>}></Route>
    <Route path="/budgets" element= {<Budgets/>}></Route>
    <Route path="/transactions" element= {<TransactionsPage/>}></Route>
    </Routes>
    </BrowserRouter>
  {/* <RouterProvider router ={router}></RouterProvider> */}
  
    </>
  )
  
}

export default App;