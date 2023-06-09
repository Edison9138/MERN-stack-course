import {BrowserRouter, Routes, Route } from "react-router-dom"
import { Register, Error, Landing, ProtectedRoute } from "./pages";
// for nested routes
import { AddJob, AllJobs, Profile, SharedLayout, Stats} from "./pages/dashboard"
// import styled from "styled-components"
// create element using styled component*/
// const Button = styled.button`
//   background: red;
//   color: white;
//   font-size: 1rem;
// `

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* home route or parent */}
        <Route path = "/" element = {
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>}>
          {/* Nested routes */}
          {/* set Stats page as the homepage */}
          <Route index element = {<Stats />}/>
          <Route path = "all-jobs" element = {<AllJobs />}/>
          <Route path = "add-job" element = {<AddJob />}/>
          <Route path = "profile" element = {<Profile />}/>
        </Route>
        <Route path = "/register" element = {<Register />}/>
        <Route path = "/landing" element = {<Landing />}/>
        <Route path = "*" element = {<Error/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
