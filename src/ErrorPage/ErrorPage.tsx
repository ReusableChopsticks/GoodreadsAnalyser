import {  Link, } from "react-router";
import './ErrorPage.css';

export default function ErrorPage() {
  return (
    <div className='error-page'>
      <h1>Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="link">Return home</Link>
    </div>
  );
}