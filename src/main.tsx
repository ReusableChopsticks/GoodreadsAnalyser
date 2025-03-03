import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './reset.css'
import './util.css'

import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router";
import ErrorPage from './ErrorPage.tsx';
import ViewPage from './ViewPage/ViewPage.tsx';
import HomePage from './HomePage/HomePage.tsx';
import ScrapsPage from './scraps/thejoyoflearningts.tsx';
import BookPage from './BookPage/BookPage.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<p>ERROR!!!!!!</p>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<ScrapsPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
