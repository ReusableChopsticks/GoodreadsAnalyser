import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './reset.css'
import './util.css'

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";

import ErrorPage from './ErrorPage/ErrorPage.tsx';
import ViewPage from './ViewPage/ViewPage.tsx';
import HomePage from './HomePage/HomePage.tsx';
import ScrapsPage from './scraps/thejoyoflearningts.tsx';
import BookPage from './BookPage/BookPage.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/GoodreadsAnalyser">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/scraps" element={<ScrapsPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
