import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { GOODREADS_FIELDS, setData } from "../Data/repo";




export default function HomePage() {
  let fileReader: FileReader;
  const navigate = useNavigate();
  const { readString } = usePapaParse();
  
  const handleFileRead = () => {
    const content = fileReader.result as string;
    const readData: any = readString(content, {header: true} as any);
    console.log(readData);

    if (readData.meta.fields.every((field: string, index: number) => field === GOODREADS_FIELDS[index])) {
      setData(readData.data);
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