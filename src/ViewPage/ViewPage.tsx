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
      
    </>
  );
}

const getTotalBookCount = (data: GoodreadsDataField[]) => {
  return data.length;
}

const getTotalPageCount = (data: GoodreadsDataField[]): number => {
  return data.reduce((sum, book) => sum += book["Number of Pages"], 0);
}
