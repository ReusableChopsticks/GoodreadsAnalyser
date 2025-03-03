import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './reset.css'
import './util.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import ErrorPage from './ErrorPage.tsx';
import ViewPage from './ViewPage/ViewPage.tsx';
import HomePage from './HomePage/HomePage.tsx';
import ScrapsPage from './scraps/thejoyoflearningts.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "view",
    element: <ViewPage />
  },
  {
    path: "scraps",
    element: <ScrapsPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
