import { useContext, useEffect, useState } from "react";
import { getData, GoodreadsDataField } from "../Data/repo";

export default function ViewPage() {
  const [viewData, setViewData] = useState<GoodreadsDataField[]>(getData())

  // load the data in
  useEffect(() => {
    const readBooksOnly = getData().filter((field) => field['Exclusive Shelf'] === "read");
    setViewData(readBooksOnly);
  }, []);

  return (
    <>
      <p>whats up bro</p>
      <div>
        {
          viewData.map((book) => {
            return <p>{book.Title}</p>
          })
        }
      </div>
    </>
  );
}
