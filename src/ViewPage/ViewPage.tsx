import { useEffect, useState } from "react";
import { clamp, getData, GoodreadsDataField, randomIntRange } from "../Data/repo";
import { PAGE_HEIGHT_M, PX_PER_PAGE } from "../Data/constants";

import "./ViewPage.css";
import { useNavigate } from "react-router-dom";


interface BookSpineProps {
  // h is a number between [0, 1] evenly spaced by the golden ratio
  h: number;
  title: string;
  author: string;
  pages: number;
}

/**
 * TODO: find a better way to calculate indent
 */
const MIN_INDENT = 10;
const MAX_INDENT = 20;
const MIN_TITLE_FONT_SIZE_PX = 12;
const MAX_TITLE_FONT_SIZE_PX = 24;
const golden_ratio_conjugate = 0.618033988749895;
const BookSpine = ({ h, title, author, pages }: BookSpineProps) => {
  // make sure hues are evenly spaced using the golden ratio, following [https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/]
  
  // for fun, this line makes the book heights to scale!
  // TODO: make this a feature!!!!!
  // const height = pages * PX_PER_PAGE;
  
  // this number looks more pleasant. Make a slider for these values [0.15, pages * PX_PER_PAGE]
  const height = pages * 0.18;

  const spineStyle: React.CSSProperties = {
    backgroundColor: `hsl(${h*360},90%,90%)`,
    marginRight: h * (MAX_INDENT - MIN_INDENT) + MIN_INDENT + "%",
    minHeight: `${height}px`,
    maxHeight: `${height}px`,
  };

  // adjust title font size based on height of spine so it should generally all fit
  const titleStyle: React.CSSProperties = {
    fontSize: `${clamp(height * 0.3, MIN_TITLE_FONT_SIZE_PX, MAX_TITLE_FONT_SIZE_PX)}px`,
  }

  return (
    <div className="book-spine" style={spineStyle}>
      <span className="spine-author">{author}</span>
      <span className="spine-title" style={titleStyle}>{title}</span>
    </div>
  );
};

export default function ViewPage() {
  const [books, setBooks] = useState<GoodreadsDataField[]>(getData());

  const [shelves, setShelves] = useState<string[]>([...new Set(books.map(book => book["Exclusive Shelf"]))])

  const navigate = useNavigate();

  // initial value for hue of book spine
  let h = Math.random();

  const handleShelfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "all") {
      setBooks(getData());
    } else {
      const filtered = getData().filter((book) => {
        return book["Exclusive Shelf"] === e.target.value;
      });
      setBooks(filtered);
    }
  }

  return (
    <div className="view-page">
      <div
        className="statistics-view | flow"
        style={{ "--flow-spacer": "2rem" } as React.CSSProperties}
      >
        <h1>Overall Statistics</h1>

        <label htmlFor="filter-shelf">
          Filter by shelf
          <select onChange={handleShelfChange} id="filter-shelf">
            <option value="all">all</option>
            {shelves.map((shelf) => <option value={shelf}>{shelf}</option>)}
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
            <BookSpine h={h} title={book.Title} author={book.Author} pages={book["Number of Pages"]}/>
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

  if (validBooks === 0) {
    return 0;
  }
  return Math.ceil(totalReadTime / validBooks);
};
