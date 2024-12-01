import React from 'react';
import ReactDOM from 'react-dom/client';
//import AppRouter from './AppRouter.js';
import './index.css';
import Group from './screens/Group.js';
import GroupDetails from './screens/GroupDetails.js';
import Authentication, { AuthenticationMode } from './screens/Authentication.js';
import ErrorPage from './screens/ErrorPage.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.js';
import UserProvider from './context/UserProvider.js';


const router = createBrowserRouter([
  {errorElement: <ErrorPage />},
  {path: '/signin', element: <Authentication authenticationMode={AuthenticationMode.Login} />},
  {path: '/signup', element: <Authentication authenticationMode={AuthenticationMode.Register} />},
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <Group /> }, { path: "/group/:id", element: <GroupDetails /> }]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>
);
/*
ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);
*/
