import { NavLink } from "react-router";
import "./NavBar.css";

export default function NavBar() {

  return (
    <div className="navbar">
      <div className="left">
        <NavLink to="/" >Home</NavLink>
        <NavLink to="/view">View</NavLink>
      </div>

      <div className="right">
        <span>About</span>
      </div>
      
      
    </div>
  )
}