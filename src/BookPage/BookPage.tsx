import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getById, GoodreadsDataField } from "../Data/repo";
import { MoonLoader } from "react-spinners";


import "./BookPage.css";
import Markdown from "react-markdown";

const ReadMore = ({ children }: { children: string }) => {
  const [expanded, setExpanded] = useState(false);
  const longDescLength = 500;

  return children.length < longDescLength ? (
    convertMarkdown(children)
  ) : (
    <div className="read-more" data-expanded={expanded}>
      <div className="read-more-content" data-expanded={expanded}>{convertMarkdown(children)}</div>
      <span className="read-more-link" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show less ↑" : "Read more ↓"}
      </span>
    </div>
  );
};

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const [book] = useState<GoodreadsDataField>(getById(id));
  const [bookCoverURL, setBookCoverURL] = useState<string>("");
  // TODO: learn how to type this!
  // always use the first search result for simplicity
  const [googleData, setGoogleData] = useState<any>();

  useEffect(() => {
    const loadCover = async () => {
      const title = book["Title"]
        .split(" ")
        .join("+")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const author = book["Author l-f"]
        .split(", ")
        .join("+")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`
      );

      if (result) {
        console.log(result.data.items[0]);
        setGoogleData(result.data.items[0]);
        const rawUrl = result.data.items[0].volumeInfo.imageLinks.thumbnail;
        const zoomedUrl = rawUrl.replace("zoom=1", "zoom=100");
        setBookCoverURL(zoomedUrl);
        console.log(book.ISBN13);
      } else {
        setGoogleData(null);
      }
    };
    loadCover();
  }, []);

  return (
    <>
      {googleData ? (
        // if google data is loaded, render the page
        <div className="book-page">
          <div className="left-column | flow">
            <img className="book-cover" src={bookCoverURL} alt="Book cover" />
            <h3>Metadata</h3>
            <div className="metadata | even-columns">
              <div>
                <h4>ISBN13</h4>
                <span>
                  {book.ISBN13 !== "" && book.ISBN13 !== `=""`
                    ? book.ISBN13.slice(2, -1)
                    : googleData.volumeInfo.industryIdentifiers[0].identifier}
                </span>
              </div>
              <div>
                <h4>ISBN10</h4>
                <span>
                  {book.ISBN !== "" && book.ISBN !== `=""`
                    ? book.ISBN.slice(2, -1)
                    : googleData.volumeInfo.industryIdentifiers[1].identifier}
                </span>
              </div>
              <div>
                <h4>Page count</h4>
                <span>{book["Number of Pages"]}</span>
              </div>
              <div>
                <h4>Bookshelves</h4>
                <span>{getBookshelves(book)}</span>
              </div>
              <div>
                <h4>Publisher</h4>
                <span>{googleData.volumeInfo.publisher}</span>
              </div>
              
              {
                book["Original Publication Year"] &&
                <div>
                  <h4>Original Publication Year</h4>
                  <span>{book["Original Publication Year"]}</span>
                </div>
              }
            </div>
          </div>

          <div className="right-column | flow">
            <div className="titles">
              <h1>{book.Title}</h1>
              <h2>{book.Author}</h2>
            </div>
            {
              book["Additional Authors"] &&
              <span>and {book["Additional Authors"]}</span>
            }
            {googleData.volumeInfo.description ? (
              <div className="description">
                <ReadMore>{googleData.volumeInfo.description}</ReadMore>
              </div>
            ) : (
              <p>No description available.</p>
            )}
            <div className="even-columns">
              <div>
                <h3>Average rating</h3>
                <p>{book["Average Rating"]}</p>
              </div>
              <div>
                <h3>Your rating</h3>
                <p>{book["My Rating"].toFixed(2)}</p>
              </div>
              <div>
                <h3>Date added</h3>
                <p>{book["Date Added"]}</p>
              </div>
              <div>
                <h3>Date read</h3>
                <p>{book["Date Read"] ? book["Date Read"] : "Not read yet"}</p>
              </div>
            </div>
            <div>
              <h3>Your review</h3>
              {book["My Review"] ? (
                <ReadMore>{book["My Review"]}</ReadMore>
              ) : (
                "No review set."
              )}
            </div>
            <Link className="button" to="/view">
              Back
            </Link>
          </div>
        </div>
      ) : (
        // loading spinner
        <div className="loading-book">
          <MoonLoader />
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}

const getBookshelves = (book: GoodreadsDataField) => {
  const shelves = book["Bookshelves"] ? book["Bookshelves"].split(", ") : [];
  if (!shelves.includes(book["Exclusive Shelf"])) {
    shelves.push(book["Exclusive Shelf"]);
  }
  return shelves.join(", ");
};

// goodreads actually lets html be used in reviews but i dont know how to sanitise it in react
const convertMarkdown = (text: string) => {
  // for whatever reason, react-markdown does not like <br/> tags so this will do.
  text = text.replaceAll("<br/>", "\n");

  // for some reason i tried turning it into markdown first but why
  // const Turndown = (window as any).TurndownService;
  // const md = new Turndown().turndown(text);
  // console.log(md);

  return <Markdown>{text}</Markdown>;
};
