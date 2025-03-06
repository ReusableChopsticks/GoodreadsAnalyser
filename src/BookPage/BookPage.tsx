import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getById, GoodreadsDataField } from "../Data/repo";
import { BarLoader, MoonLoader } from "react-spinners";

import "./BookPage.css";

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const [book] = useState<GoodreadsDataField>(getById(id));
  const [bookCoverURL, setBookCoverURL] = useState<string>("");
  // TODO: learn how to type this!
  // always the first search result
  const [googleData, setGoogleData] = useState<any>();

  useEffect(() => {
    const loadCover = async () => {
      const title = book["Title"].split(" ").join("+");
      const author = book["Author l-f"].split(", ").join("+");

      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`
      );

      console.log(result.data.items[0]);

      setGoogleData(result.data.items[0]);
      const rawUrl = result.data.items[0].volumeInfo.imageLinks.thumbnail;
      const zoomedUrl = rawUrl.replace("zoom=1", "zoom=10");
      setBookCoverURL(zoomedUrl);
    };
    loadCover();
  }, []);

  return (
    <div className="book-page">
      {googleData ? (
        <>
          <div className="left-column">
            <img className="book-cover" src={bookCoverURL} alt="Book cover" />
            <div className="metadata">
              <h2>Metadata</h2>
              <div>
                <h3>ISBN</h3>
                <span>
                  {book.ISBN
                    ? book.ISBN
                    : googleData.volumeInfo.industryIdentifiers[0].identifier}
                </span>
              </div>
              <div>
                <h3>Page count</h3>
                <span>{book["Number of Pages"]}</span>
              </div>
              <div>
                <h3>Bookshelves</h3>
                <span>{book.Bookshelves}</span>
              </div>
            </div>
          </div>

          <div className="right-column">
            <h1>{book.Title}</h1>
            <h2>{book.Author}</h2>
            <details>
              <summary>Description</summary>
              {googleData.volumeInfo.description}
            </details>
            <div className="even-columns">
              <div>
                <h3>Average rating</h3>
                <p>{book["Average Rating"]}</p>
              </div>
              <div>
                <h3>Your rating</h3>
                <p>{book["My Rating"]}</p>
              </div>
              <div>
                <h3>Date read</h3>
                <p>{book["Date Read"] ? book["Date Read"] : "Not read yet"}</p>
              </div>
            </div>
            <div>
              <h3>Your review</h3>
              <p>{
              book["My Review"] 
                ? 
              <div dangerouslySetInnerHTML={sanitizeHTML(book["My Review"])}></div>
                : 
              "No review set."}
              </p>
            </div>
            <div className=""></div>
            <Link className="button" to="/view">
              Back
            </Link>
          </div>
        </>
      ) : (
        <MoonLoader />
      )}
    </div>
  );
}


// TODO: Sanitize the HTML in the review field to prevent XSS attacks
const sanitizeHTML = (html: string) => {
  return {__html: html};
}
