import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getById, GoodreadsDataField } from "../Data/repo";
import { MoonLoader } from "react-spinners";

import "./BookPage.css";
import Markdown from "react-markdown";

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const [book] = useState<GoodreadsDataField>(getById(id));
  const [bookCoverURL, setBookCoverURL] = useState<string>("");
  // TODO: learn how to type this!
  // always the first search result
  const [googleData, setGoogleData] = useState<any>();

  useEffect(() => {
    const loadCover = async () => {
      // remove any text after a hyphen, parentheses or colon and format the title for the search query
      const title = book["Title"].replace(/[—\(:].*$/, '').split(" ").join("+").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const author = book["Author l-f"].split(", ").join("+").normalize('NFD').replace(/[\u0300-\u036f]/g, '');
console.log(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`)
      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=partial`
      );

      console.log(result);

      setGoogleData(result.data.items[0]);
      const rawUrl = result.data.items[0].volumeInfo.imageLinks.thumbnail;
      const zoomedUrl = rawUrl.replace("zoom=1", "zoom=100");
      setBookCoverURL(zoomedUrl);
    };
    loadCover();
  }, []);

  return (
    <div className="book-page">
      {googleData ? (
        // if google data is loaded, render the page
        <>
          <div className="left-column | flow">
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
                <span>{getBookshelves(book)}</span>
              </div>
            </div>
          </div>

          <div className="right-column | flow">
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
              {/* <p> */}
                {
              book["My Review"] 
                ? 
              // <div dangerouslySetInnerHTML={sanitizeHTML(book["My Review"])}></div>
              // <Markdown components={{br: 'a'}}>{'# Hi, *Pluto*! \n okkk'}</Markdown>
              convertMarkdown(book["My Review"])
                : 
              "No review set."
              }
              {/* </p> */}
            </div>
            <div className=""></div>
            <Link className="button" to="/view">
              Back
            </Link>
          </div>
        </>
      ) : (
        // loading spinner
        <MoonLoader />
      )}
    </div>
  );
}

const getBookshelves = (book: GoodreadsDataField) => {
  // make into set to avoid repetition
  const shelves = new Set(book["Bookshelves"].split(", "));
  shelves.add(book["Exclusive Shelf"]);
  
  let formatted = '';
  shelves.forEach(shelf => {
    if (shelf) {formatted += shelf + ', ';}
  });
  return formatted.slice(0, -2);
}

// goodreads actually lets html be used in reviews but i dont know how to sanitise it in react
const convertMarkdown = (text: string) => {
  // for whatever reason, react-markdown does not like <br/> tags so this will do.
  // text = text.replaceAll("<br/>", "\n");
  const Turndown = (window as any).TurndownService;
  const md = new Turndown().turndown(text);
  console.log(md);

  return (
    <Markdown>{md}</Markdown>
  )
}