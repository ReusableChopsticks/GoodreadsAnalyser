import { useEffect, useState } from "react";
import { getData, GoodreadsDataField } from "../Data/repo";
import { PAGE_HEIGHT_M } from "../Data/constants";

import "./ViewPage.css";
import { useNavigate } from "react-router-dom";

export default function ViewPage() {
  const [books, setBooks] = useState<GoodreadsDataField[]>(getData());
  const totalBooks = getTotalBookCount(books);
  const totalPages = getTotalPageCount(books);

  const navigate = useNavigate();

  // load the data in on page load
  useEffect(() => {
    // const readBooksOnly = getData().filter((field) => field['Exclusive Shelf'] === "read");
    // setbooks(readBooksOnly);
    // console.log(readBooksOnly);
    // setbooks(getData());
  }, []);

  return <div className="view-page | even-columns">
    <div className="statistics-view | flow" style={{"--flow-spacer": "2rem"} as React.CSSProperties}>
      <h1>Overall Statistics</h1>

      <label htmlFor="filter-shelf">
        Filter by shelf
        <select id="filter-shelf">
          <option value="read">read</option>
          <option value="read">GENERATE BASED ON SHELVES</option>
        </select>
      </label>
      
      <div className="stat-columns | even-columns">
        <div className="total-pages">
          <h2>Total pages read</h2>
          <span>{getTotalPageCount(books)}</span>
        </div>
        <div className="total-books">
          <h2>Total books read</h2>
          <span>{getTotalBookCount(books)}</span>
        </div>
        <div className="avg-pages">
          <h2>Average book length</h2>
          <span>{"placeholder"}</span>
        </div>
        <div className="avg-stars">
          <h2>Average star rating</h2>
          <span>{getAverageStarRating(books).toFixed(2)}</span>
        </div>
        <div className="avg-read-time">
          <h2>Average read time</h2>
          <span>{getAverageReadTime(books).toFixed() + " days"}</span>
        </div>

      </div>

      <button onClick={() => navigate("/")}>Back</button>
    </div>
    <div className="book-tower">
      {/* <span>Your book tower is: </span>
      <span>not tall enough</span> */}
      <div className="floor" />
      <div className="book-spine">hello world nice to see you</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello world</div> 
      <div className="book-spine">hello</div> 
    </div>
  </div>;
}

const getTotalBookCount = (data: GoodreadsDataField[]) => {
  return data.length;
};

const getTotalPageCount = (data: GoodreadsDataField[]): number => {
  return data.reduce((sum, book) => (sum += book["Number of Pages"]), 0);
};

const getAverageStarRating = (data: GoodreadsDataField[]): number => {
  // Exclude books that have no ratings
  const totalRatings = data.reduce(
    (total, book) => total + (book["My Rating"] > 0 ? 1 : 0),
    0
  );

  if (totalRatings === 0) {
    return 0; // Return 0 if there are no rated books
  }
  const sumRatings = data.reduce((sum, book) => sum + book["My Rating"], 0);
  return sumRatings / totalRatings;
};

// TODO: if number of books is the same, sort authors by page count!
// ^^^ this is totally optional because who really cares
interface AuthorCount {
  author: string;
  readCount: number;
}
/**
 *
 * @param data book list
 * @returns a sorted list of objects of the top 5 authors by number of books read {author: string, readCount: number}
 */
const getFavouriteAuthors = (data: GoodreadsDataField[]): AuthorCount[] => {
  const authorCounts: { [key: string]: number } = {};
  data.forEach((book) => {
    const author = book.Author;
    authorCounts[author] = authorCounts[author] ? authorCounts[author] + 1 : 1;
  });

  const sortedAuthors = Object.keys(authorCounts)
    .sort((a, b) => authorCounts[b] - authorCounts[a])
    .map((author) => ({ author, readCount: authorCounts[author] }));

  return sortedAuthors.slice(0, 5);
};

/**
 *
 * @param totalPages total number of pages read
 * @returns the height of your book stack in meters
 */
const getBookStackHeight = (totalPages: number): number => {
  return totalPages * PAGE_HEIGHT_M;
};

/**
 * @param dateString date string formatted as DD/MM/YYYY
 * @returns the time as a date object
 */
const processDateString = (dateString: string): Date => {
  let split = dateString.split("/");
  // Date requires the string formatted as YYYY-MM-DD to work
  return new Date(`${split[2]}-${split[1]}-${split[0]}`);
}

/**
 *
 * @param data book list
 * @returns average time in days to read a book
 */
const getAverageReadTime = (data: GoodreadsDataField[]): number => {
  let validBooks = 0;
  const totalReadTime = data.reduce((total, book) => {

    console.log(book.Title);
    // if both dates not set, do not add to total
    if (!book["Date Added"] || !book["Date Read"]) {
      return total;
    }

    // find the time difference in days
    const dateAdded = processDateString(book["Date Added"]);
    const dateRead = processDateString(book["Date Read"]);

    const diffTime = Math.abs(dateRead.getTime() - dateAdded.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));


    validBooks += 1;
    return total + diffDays;
  }, 0);

  console.log(`validBooks: ${validBooks}`);
  console.log(`totalReadTime: ${totalReadTime}`);

  if (validBooks === 0) { return 0; }
  return Math.ceil(totalReadTime / validBooks);
};
