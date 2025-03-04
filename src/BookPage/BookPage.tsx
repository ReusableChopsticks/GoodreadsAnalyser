import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getById, GoodreadsDataField } from "../Data/repo";

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const [book] = useState<GoodreadsDataField>(getById(id));
  const [bookCoverURL, setBookCoverURL] = useState<string>('');
  
  useEffect(() => {
    const loadCover = async () => {
      const title = book["Title"].split(" ").join("+");
      const author = book["Author l-f"].split(", ").join("+");

      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`);
      const rawUrl = result.data.items[0].volumeInfo.imageLinks.thumbnail
      const zoomedUrl = rawUrl.replace("zoom=1", "zoom=100");
      setBookCoverURL(zoomedUrl);
    }
    loadCover();
  }, []);

  return (
    <div>
      <h1>Book Page</h1>
      <h2>{book.Title}</h2>
      <img src={bookCoverURL} alt="Book cover" width={"30%"}/>
      <Link to="/view">Back</Link>
    </div>
  )
}