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
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Review from "./pages/Review";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route>
            <Route element={<Body />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:toUserId" element={<Chat />} />
              <Route path="/review" element={<Review />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
