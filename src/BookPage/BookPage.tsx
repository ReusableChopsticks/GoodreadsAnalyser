import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getById, GoodreadsDataField } from "../Data/repo";
import { BarLoader } from "react-spinners";

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const [book] = useState<GoodreadsDataField>(getById(id));
  const [bookCoverURL, setBookCoverURL] = useState<string>('');
  // TODO: learn how to type this!
  // always the first search result
  const [googleData, setGoogleData] = useState<any>();
  
  
  useEffect(() => {
    console.log("loaded")
    const loadCover = async () => {
      const title = book["Title"].split(" ").join("+");
      const author = book["Author l-f"].split(", ").join("+");

      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`);
      setGoogleData(result.data.items[0]);
      console.log(result.data.items[0]);
      const rawUrl = result.data.items[0].volumeInfo.imageLinks.thumbnail
      const zoomedUrl = rawUrl.replace("zoom=1", "zoom=100");
      setBookCoverURL(zoomedUrl);
    }
    loadCover();
  }, [googleData]);

  return (
    <div className="book-page">
      <h1>{book.Title}</h1>
      <h2>{book.Author}</h2>
      {
        googleData ? 
        <img src={bookCoverURL} alt="Book cover" width={"30%"}/>
        :
        <BarLoader />
      }
      <div className="metadata">
        <h2>Metadata</h2>
        <div>
          <h3>ISBN</h3>
          <span>{book.ISBN ? book.ISBN : googleData.volumeInfo.industryIdentifiers[0].identifier}</span>
        </div>
        <div>
          <h3>Page count</h3>
          <span></span>
        </div>
        <div>
          <h3>Bookshelf</h3>
          <span></span>
        </div>
      </div>
      <h1>DESCRIPTIONNNNN</h1>
      <p>
        <i>{googleData ? googleData.volumeInfo.description : <BarLoader />}</i>
      </p>
      <div>
        <h3>Average rating</h3>
        <p>{book["Average Rating"]}</p>
      </div>
      <div>
        <h3>Your rating</h3>
        <p>
          {book["My Rating"]}
        </p>
      </div>
      <div>
        <h3>Your review</h3>
        <p>{book["My Review"] ? book["My Review"] : "No review set."}</p>
      </div>
      <div>
        <h3>Date read</h3>
        <p>{book["Date Read"] ? book["Date Read"] : "Not read yet"}</p>
      </div>

      <Link className="button" to="/view">Back</Link>
    </div>
  )
}