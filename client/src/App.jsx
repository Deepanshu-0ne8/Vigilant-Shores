import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Signup from "./components/Signup";
import SubmitReport from "./components/SubmitReport";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";
import axios from 'axios';

axios.defaults.withCredentials = true;


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // --- Protected Routes ---
  // 2. Create a parent route that uses ProtectedRoute as its element.
  {
    element: <ProtectedRoute />,
    // 3. Nest all the routes you want to protect inside its `children` array.
    children: [
      {
        path: "/report/submit",
        element: <SubmitReport />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <AuthProvider>
        <LocationProvider>
          <RouterProvider router={appRouter} />
        </LocationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
