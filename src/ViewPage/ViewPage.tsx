import { useEffect, useState } from "react";
import { getData, GoodreadsDataField } from "../Data/repo";

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

      <h2>Favourite Authors</h2>
      <p>
        <ol>
          {
            getFavouriteAuthors(books).map((author) => {
              return <li>{author}</li>
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
  // Exclude books that have no ratings from the average
  const totalRatings = data.reduce((total, book) => total + (book["My Rating"] > 0 ? 1 : 0), 0);
  if (totalRatings === 0) {
    return 0; // Return 0 if there are no rated books
  }
  const sumRatings = data.reduce((sum, book) => sum + book["My Rating"], 0);
  return sumRatings / totalRatings;
}

// TODO: make it return the count of books by each author
const getFavouriteAuthors = (data: GoodreadsDataField[]): string[] => {
  const authorCounts: { [key: string]: number } = {};
  data.forEach((book) => {
    const author = book.Author;
    authorCounts[author] = authorCounts[author] ? authorCounts[author] + 1 : 1;
  });

  const sortedAuthors = Object.keys(authorCounts).sort((a, b) => authorCounts[b] - authorCounts[a]);
  return sortedAuthors.slice(0, 5);
}