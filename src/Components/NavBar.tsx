import { NavLink } from "react-router";
import "./NavBar.css";

export default function NavBar() {

  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/view">View</NavLink>
      About
      
    </div>
  )
}