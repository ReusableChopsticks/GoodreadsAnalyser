import { Link } from "react-router-dom"

export default function ErrorPage () {
  return (
    <>
      <p>
        Looks like something went wrong...
      </p>
      <p>
        <i>Page not found</i>
      </p>
      
      <Link to="/" style={{textDecoration: "underline"}}>Return home</Link>
    </>
  )
}