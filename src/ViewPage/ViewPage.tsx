import { useEffect, useRef, useState } from "react";
import {
  clamp,
  getData,
  GOODREADS_FIELDS,
  GoodreadsDataField,
  randomIntRange,
} from "../Data/repo";
import {
  HEIGHT_COMPARISONS,
  HeightComparisonObject,
  PAGE_HEIGHT_M,
  PX_PER_PAGE,
} from "../Data/constants";

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
    backgroundColor: `hsl(${h * 360},90%,90%)`,
    marginRight: h * (MAX_INDENT - MIN_INDENT) + MIN_INDENT + "%",
    minHeight: `${height}px`,
    maxHeight: `${height}px`,
  };

  // adjust title font size based on height of spine so it should generally all fit
  const titleStyle: React.CSSProperties = {
    fontSize: `${clamp(
      height * 0.3,
      MIN_TITLE_FONT_SIZE_PX,
      MAX_TITLE_FONT_SIZE_PX
    )}px`,
  };

  return (
    <div className="book-spine" style={spineStyle}>
      <span className="spine-author">{author}</span>
      <span className="spine-title" style={titleStyle}>
        {title}
      </span>
    </div>
  );
};

export default function ViewPage() {
  // this type is needed for dynamic accessing of GoodreadsDataField objects
  type BookKeys = keyof GoodreadsDataField;
  type OrderOptions = "Ascending" | "Descending";

  const [books, setBooks] = useState<GoodreadsDataField[]>(getData());
  const [totalPageCount] = useState<number>(getTotalPageCount(books));
  const [shelves] = useState<string[]>([
    ...new Set(books.map((book) => book["Exclusive Shelf"])),
  ]);

  const sortByOptions = ["Date Added", "Title", "Author", "Average Rating", "Number of Pages"];
  const [sortOrder, setSortOrder] = useState<OrderOptions>("Ascending");
  const [sortBy, setSortBy] = useState<BookKeys>("Date Added");

  const bookTowerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // initial random value for hue of book spines
  let h = Math.random();
  
  // display the top of the book tower first
  useEffect(() => {
    const onInitialLoad = () => {
      bookTowerRef.current?.scrollTo({top: -bookTowerRef.current?.scrollHeight, behavior: "instant"})
    }
    onInitialLoad();
  }, [])

  /**
   * orders and then assigns the books state so sort options are maintained when switching shelves 
   * @param bookList the unsorted list of books to display
   * @param field what field to sort the books by
   */
  const setSortedBooks = (bookList: GoodreadsDataField[], field: BookKeys) => {
    setBooks(bookList.toSorted((a, b) => {
      let val = 0;
      if (a[field] > b[field]) {
        val = -1;
      }
      else if (b[field] > a[field]) {
        val = 1;
      }
      else {
        val = 0;
      }
      if (sortOrder === "Descending") {
        val = -val;
      }
      return val;
    }))
  }

  const handleShelfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "all") {
      setSortedBooks(getData(), sortBy);
    } else {
      const filtered = getData().filter((book) => {
        return book["Exclusive Shelf"] === e.target.value;
      });
      setSortedBooks(filtered, sortBy);
    }
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as BookKeys);
    setSortedBooks(books, e.target.value as BookKeys);
  }

  return (
    <div className="view-page">
      <div
        className="statistics-view | flow"
        style={{ "--flow-spacer": "2rem" } as React.CSSProperties}
      >
        <h1>Overall Statistics</h1>

        <label htmlFor="select-filter-shelf">
          Filter by shelf
          <select onChange={handleShelfChange} id="select-filter-shelf">
            <option key="all" value="all">
              all
            </option>
            {shelves.map((shelf) => (
              <option key={shelf} value={shelf}>
                {shelf}
              </option>
            ))}
          </select>
        </label>

        <div className="sort-options">
          <label htmlFor="select-sort-by">
            Sort by
            <select onChange={handleSortBy} id="select-sort-by" value={sortBy}>
              {
                sortByOptions.map((sortOption) => {
                  return <option key={sortOption} value={sortOption}>{sortOption}</option>
                })
              }
            </select>
          </label>

          <label htmlFor="select-order">
            Order
            <select id="select-order" value={sortOrder} onChange={(e) => {setSortOrder(e.target.value as OrderOptions); setBooks(books.toReversed())}}>
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
            </select>
          </label>
        </div>

        <div className="stat-columns | even-columns">
          <div className="total-pages">
            <h2>Total pages</h2>
            <span>{totalPageCount.toLocaleString() + " pages"}</span>
          </div>
          <div className="total-books">
            <h2>Total books</h2>
            <span>{getTotalBookCount(books)}</span>
          </div>
          <div className="avg-pages">
            <h2>Average page count</h2>
            <span>{(totalPageCount / books.length).toFixed() + " pages"}</span>
          </div>
          <div className="avg-stars">
            <h2>Average star rating given</h2>
            <span>{getAverageStarRating(books).toFixed(2)}</span>
          </div>
          <div className="avg-read-time">
            <h2>Average read time</h2>
            <span>{getAverageReadTime(books).toFixed() + " days"}</span>
          </div>
        </div>

        <button onClick={() => navigate("/")}>Back</button>
      </div>

{/* ####################################### */}

      <div className="book-tower" ref={bookTowerRef}>
        <div className="scroll-shortcuts">
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            bookTowerRef.current?.scrollTo({top: -bookTowerRef.current?.scrollHeight, behavior: "smooth"})
            }}>Top</a>
          {"   "}
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            bookTowerRef.current?.scrollTo({top: 0, behavior: "smooth"})
            }}>Bottom</a>
        </div>
        <div className="floor" />
        {books.map((book) => {
          // keep adding the golden ratio so similar colours do not appear next to each other
          h += golden_ratio_conjugate;
          h %= 1;
          return (
            <BookSpine
              key={book["Book Id"]}
              h={h}
              title={book.Title}
              author={book.Author}
              pages={book["Number of Pages"]}
            />
          );
        })}

        <div className="height-display">
          <p style={{ fontSize: "1.5rem" }}>Your tower is </p>
          <p style={{ fontSize: "2rem" }}>{`${getBookStackHeight(
            totalPageCount
          ).toFixed(2)}m tall`}</p>
          <p style={{ fontSize: "1rem" }}>{`... which is taller than ${
            getHeightComparison(getBookStackHeight(totalPageCount)).name
          }`}</p>
          {/* <p className="fs-small">{getHeightComparison(stackHeight).description}</p> */}
        </div>
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

interface AuthorCount {
  author: string;
  readCount: number;
}
/**
 * Gets a list of your 5 most read authors by book count
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
 * Calculates the height of all your books stacked on top of each other
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

/**
 * Gets the first object your book stack is taller than
 * @param height height of book stack
 * @returns the largest object which is smaller than your book stack
 */
const getHeightComparison = (height: number): HeightComparisonObject => {
  for (let i = 0; i < HEIGHT_COMPARISONS.length; i++) {
    if (height < HEIGHT_COMPARISONS[i].height) {
      return HEIGHT_COMPARISONS[i - 1];
    }
  }
  return HEIGHT_COMPARISONS[-1];
};
