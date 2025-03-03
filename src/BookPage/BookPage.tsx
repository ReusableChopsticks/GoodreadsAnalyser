import { useParams } from "react-router";

export default function BookPage() {
  const id = useParams().id;
  console.log(useParams());

  return (
    <div>
      <h1>Book Page</h1>
      <p>Book ISBN: {id}</p>
    </div>
  )
}