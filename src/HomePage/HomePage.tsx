import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { GOODREADS_FIELDS, setData } from "../Data/repo";

const dynamicTypingFields = { 
  "Number of Pages": true, 
  "My Rating": true ,
  "Avergae Rating": true,
  "Year Published": true,
  "Original Publication Year": true,
  "Read Count": true,
  "Owned Copies": true,
};

export default function HomePage() {
  let fileReader: FileReader;
  const navigate = useNavigate();
  const { readString } = usePapaParse();

  const handleFileRead = () => {
    const content = fileReader.result as string;
    const readData: any = readString(content, {
      header: true,
      dynamicTyping: dynamicTypingFields,
    } as any);
    // console.log(readData);

    // if file uploaded is correct (a goodreads export) and not empty
    let valid = true;
    if (readData.data.length === 0) {
      console.log("INVALID FILE: file is empty");
      valid = false;
    }
    if (
      !readData.meta.fields.every(
        (field: string, index: number) => field === GOODREADS_FIELDS[index]
      )
    ) {
      console.log(
        "INVALID FILE: fields do not match. Did you upload a different file by accident?"
      );
      valid = false;
    }

    if (valid) {
      setData(readData.data);
      navigate("view");
    }
  };

  const handleFileChosen = (file: File) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <>
      <input
        accept=".csv"
        type="file"
        onChange={(e) => {
          // handle possible null to make typescript happy
          const file = e.target.files?.[0];
          if (file) {
            handleFileChosen(file);
          }
        }}
      />
    </>
  );
}
