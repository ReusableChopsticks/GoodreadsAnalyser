import { useEffect, useState } from "react";
import { getData, GoodreadsDataField } from "../Data/repo";

export default function ViewPage() {
  const [viewData, setViewData] = useState<GoodreadsDataField[]>(getData())

  // load the data in on page load
  useEffect(() => {
    // const readBooksOnly = getData().filter((field) => field['Exclusive Shelf'] === "read");
    // setViewData(readBooksOnly);
    // console.log(readBooksOnly);
    setViewData(getData());
  }, []);

  return (
    <>
      <ol>
        {
          viewData.map((book) => {
            return <li>{book.Title}</li>
          })
        }
      </ol>
      
    </>
  );
}


