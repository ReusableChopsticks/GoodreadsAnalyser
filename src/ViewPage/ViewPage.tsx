import { useContext, useEffect } from "react";
import { DataContext } from "../Contexts/DataContext";

export default function ViewPage() {
  const dataContext = useContext(DataContext);

  useEffect(() => {
    console.log("VIEW PAGE ########");
    console.log(dataContext?.getData());
  }, []);

  return (
    <>
      <p>whats up bro</p>
      <div>
        {
          dataContext?.getData().toLocaleString()
        }
      </div>
    </>
  );
}
