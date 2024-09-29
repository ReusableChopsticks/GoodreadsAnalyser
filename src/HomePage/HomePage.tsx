import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { GOODREADS_FIELDS, GoodreadsDataField, setData } from "../Data/repo";



export default function HomePage() {
  let fileReader: FileReader;
  const navigate = useNavigate();
  const { readString } = usePapaParse();
  
  const handleFileRead = () => {
    const content = fileReader.result as string;
    const readData: any = readString(content, {header: true} as any);
    console.log(readData);

    if (readData.meta.fields.every((field: string, index: number) => field === GOODREADS_FIELDS[index])) {
      setData(processData(readData.data));
      navigate('view');
    } else {
      console.log("INVALID FILE: FIELDS DO NOT MATCH");
    }

  }

  const handleFileChosen = (file: File) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  }

  return (
    <>
      <input accept=".csv" type="file" onChange={(e) => {
        // handle possible null to make typescript happy
        const file = e.target.files?.[0];
        if (file) {
          handleFileChosen(file)
        }
      }}/>
    </>
  )
}

const processData = (data: GoodreadsDataField[]) => {
  let filtered: GoodreadsDataField[];
  // only use books in 'read' shelf (a.k.a. books users have read)
  filtered = data.filter((field) => field['Exclusive Shelf'] === "read");
  // process the title: remove brackets and colons
  filtered = filtered.map(field => {
    // Use regular expression to match everything after '(' or ':' and remove it
    const cleanedTitle = field.Title.replace(/[:\(].*$/, '').trim();

    // Return a new object with the cleaned title while preserving other properties
    return {
      ...field,
      Title: cleanedTitle
    };
  });

  return filtered;
}