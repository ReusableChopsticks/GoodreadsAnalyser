import { useEffect, useState } from "react";
import { getData, GoodreadsDataField } from "../Data/repo";
import { PAGE_HEIGHT_M } from "../Data/constants";

export default function ViewPage() {
  const [books, setBooks] = useState<GoodreadsDataField[]>(getData());
  const totalBooks = getTotalBookCount(books);
  const totalPages = getTotalPageCount(books);

  // load the data in on page load
  useEffect(() => {
    // const readBooksOnly = getData().filter((field) => field['Exclusive Shelf'] === "read");
    // setbooks(readBooksOnly);
    // console.log(readBooksOnly);
    // setbooks(getData());
  }, []);

  return (
    <>
      <h1>
        Overall statistics
      </h1>

      <h2>Total books</h2>
      <p>{getTotalBookCount(books)} books</p>

      <h2>Total pages</h2>
      <p>{getTotalPageCount(books)} pages</p>

      <h2>Average book length</h2>
      <p>{(totalPages / totalBooks).toFixed()} per book</p>

      <h2>Average star rating</h2>
      <p>{getAverageStarRating(books).toFixed(2)} stars</p>

      <h2>Average read time</h2>
      <p>{getAverageReadTime(books)} days</p>

      <h2>Favourite Authors</h2>
      <p>
        <ol>
          {
            getFavouriteAuthors(books).map((author) => {
              return <li>{`${author.author}: ${author.readCount}`}</li>
            })}
        </ol>
      </p>
      
    </>
  );
}

const getTotalBookCount = (data: GoodreadsDataField[]) => {
  return data.length;
}

const getTotalPageCount = (data: GoodreadsDataField[]): number => {
  return data.reduce((sum, book) => sum += book["Number of Pages"], 0);
}

const getAverageStarRating = (data: GoodreadsDataField[]): number => {
  // Exclude books that have no ratings
  const totalRatings = data.reduce((total, book) => total + (book["My Rating"] > 0 ? 1 : 0), 0);
  if (totalRatings === 0) {
    return 0; // Return 0 if there are no rated books
  }
  const sumRatings = data.reduce((sum, book) => sum + book["My Rating"], 0);
  return sumRatings / totalRatings;
}

// TODO: if number of books is the same, sort authors by page count!
// ^^^ this is totally optional because who really cares
interface AuthorCount { author: string, readCount: number }
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
    .map(author => ({ author, readCount: authorCounts[author] }));

  return sortedAuthors.slice(0, 5);
}

/**
 * 
 * @param totalPages total number of pages read
 * @returns the height of your book stack in meters
 */
const getBookStackHeight = (totalPages: number): number => {
  return totalPages * PAGE_HEIGHT_M;
}

/**
 * 
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
    const dateAdded = new Date(book["Date Added"]);
    const dateRead = new Date(book["Date Read"]);

    const diffTime = Math.abs(dateAdded.getTime() - dateRead.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    validBooks += 1;
    return total + diffDays;
  }, 0)


  return Math.ceil(totalReadTime / validBooks);
}