import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Signup from "./pages/SignUp";
import Feed from "./pages/Feed";
import { Toaster } from "react-hot-toast";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/connections' element={<Connections />} />
            <Route path='/requests' element={<Requests />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
