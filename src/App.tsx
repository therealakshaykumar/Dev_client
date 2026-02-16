import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ✅ Eager load - always needed immediately
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Body from "./components/Body";

// ✅ Lazy load - only loaded when user navigates to these routes
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/Profile"));
const Connections = lazy(() => import("./pages/Connections"));
const Requests = lazy(() => import("./pages/Requests"));
const Chat = lazy(() => import("./pages/Chat"));
const Review = lazy(() => import("./pages/Review"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ✅ Reusable loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-pink border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

// ✅ Wrapper to avoid repeating Suspense everywhere
const LazyRoute = ({ element }: { element: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {element}
  </Suspense>
);

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ✅ Public routes - eagerly loaded */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected routes - lazily loaded inside Body layout */}
          <Route element={<Body />}>
            <Route path="/feed" element={<LazyRoute element={<Feed />} />} />
            <Route path="/profile" element={<LazyRoute element={<Profile />} />} />
            <Route path="/connections" element={<LazyRoute element={<Connections />} />} />
            <Route path="/requests" element={<LazyRoute element={<Requests />} />} />
            <Route path="/chat/:toUserId" element={<LazyRoute element={<Chat />} />} />
            <Route path="/review" element={<LazyRoute element={<Review />} />} />
          </Route>

          {/* ✅ 404 */}
          <Route path="*" element={<LazyRoute element={<NotFound />} />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;