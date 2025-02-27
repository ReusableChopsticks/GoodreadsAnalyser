import { useEffect, useState } from "react";
import { getData, GoodreadsDataField, randomIntRange } from "../Data/repo";
import { PAGE_HEIGHT_M } from "../Data/constants";

import "./ViewPage.css";
import { useNavigate } from "react-router-dom";

const MIN_INDENT = 4;
const MAX_INDENT = 10;

interface BookSpineProps {
  hue: number;
  title: string;
  author: string;
  pages: number;
}

const golden_ratio_conjugate = 0.618033988749895;
const BookSpine = ({ hue, title, author, pages }: BookSpineProps) => {
  // make sure hues are evenly spaced using the golden ratio
  // https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
  const PAGE_TO_PX_RATIO = 0.1;
  const height = pages * PAGE_TO_PX_RATIO;

  const style: React.CSSProperties = {
    backgroundColor: `hsl(${hue},90%,90%)`,
    marginLeft: randomIntRange(MIN_INDENT, MAX_INDENT).toString() + "rem",
    minHeight: `${height}px`,
    maxHeight: `${height}px`,
  };

  return (
    <div className="book-spine" style={style}>
      <span className="spine-author">{author}</span>
      <span className="spine-title">{title}</span>
    </div>
  );
};

export default function ViewPage() {
  const [books, setBooks] = useState<GoodreadsDataField[]>(getData());
  const totalBooks = getTotalBookCount(books);
  const totalPages = getTotalPageCount(books);

  const navigate = useNavigate();

  // initial value for hue of book spine
  let h = Math.random();

  // load the data in on page load
  useEffect(() => {
    // const readBooksOnly = getData().filter((field) => field['Exclusive Shelf'] === "read");
    // setbooks(readBooksOnly);
    // console.log(readBooksOnly);
    // setbooks(getData());
  }, []);

  return (
    <div className="view-page | even-columns">
      <div
        className="statistics-view | flow"
        style={{ "--flow-spacer": "2rem" } as React.CSSProperties}
      >
        <h1>Overall Statistics</h1>

        <label htmlFor="filter-shelf">
          Filter by shelf
          <select id="filter-shelf">
            <option value="all">all</option>
            <option value="read">read</option>
            <option value="TODO">GENERATE BASED ON SHELVES</option>
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
        <div className="floor" />
        {books.map((book) => {
          // keep adding the golden ratio so similar colours do not appear next to each other
          h += golden_ratio_conjugate;
          h %= 1;
          return (
            <BookSpine hue={h * 360} title={book.Title} author={book.Author} pages={book["Number of Pages"]}/>
          );
        })}
      </div>
    </div>
  );
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
 * Gets the average time it takes for a book added to a shelf to be read
 * @param data book list
 * @returns average time in days to read a book
 */
const getAverageReadTime = (data: GoodreadsDataField[]): number => {
  let validBooks = 0;
  const totalReadTime = data.reduce((total, book) => {
    // if both dates not set, do not add to total
    if (!book["Date Added"] || !book["Date Read"]) {
      return total;
    }

    // find the time difference in days
    const dateAdded = new Date(book["Date Added"].replace("/", "-"));
    const dateRead = new Date(book["Date Read"].replace("/", "-"));

    const diffTime = Math.abs(dateRead.getTime() - dateAdded.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    validBooks += 1;
    return total + diffDays;
  }, 0);

  console.log(`validBooks: ${validBooks}`);
  console.log(`totalReadTime: ${totalReadTime}`);

  if (validBooks === 0) {
    return 0;
  }
  return Math.ceil(totalReadTime / validBooks);
};
