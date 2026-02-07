import { Routes, Route, Navigate } from "react-router";
import Homepage from "./Pages/HomePage";
import Login from "./Pages/login";
import Signup from "./Pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice";
import Admin from "./Pages/Admin";
import ProblemPage from "./Pages/ProblemPage";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete"
function App (){


  //code for isAuthenticated 
  const dispatch = useDispatch();
  const {isAuthenticated, user, loading }= useSelector((state)=> state.auth);

  console.log("isAuthenticated:", isAuthenticated);
console.log("user:", user);

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

  if(loading)
  {
    return <div className="min-h-screen flex item-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
      </div>;
  }

  return (
    <>
      <Routes>
        {/* private home, redirect to /login or /signup if not authed */}
        <Route path="/" element={ isAuthenticated ? <Homepage/> : <Navigate to="/signup" replace/> }/>
        {/* public routes—only show when NOT authenticated */}
        <Route path="/login" element={ !isAuthenticated ? <Login/> : <Navigate to="/" replace/> } />
        <Route path="/signup" element={ !isAuthenticated ? <Signup/> : <Navigate to="/" replace/> } />
        {/* <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} /> */}
       <Route path="/admin" element={<Admin />} />
       <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
       <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
       <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      </Routes>
    </>
  )
}

export default App;