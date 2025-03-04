import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function BookPage() {
  const [bookCoverURL, setBookCoverURL] = useState<string>('');
  const id = useParams().id;

  useEffect(() => {
    const loadCover = async () => {
      const result = await axios.get("https://www.googleapis.com/books/v1/volumes?q=vanishing-world+inauthor:murata&filter=partial");
    
      // TODO: edit this url to set zoom=100
      setBookCoverURL(result.data.items[0].volumeInfo.imageLinks.thumbnail);
    }
    loadCover();
  }, []);

  return (
    <div>
      <h1>Book Page</h1>
      <p>Book ISBN: {id}</p>
      <img src={bookCoverURL} alt="" />
    </div>
  )
}