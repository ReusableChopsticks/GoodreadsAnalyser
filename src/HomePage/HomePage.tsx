import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { setData } from "../Data/repo";




export default function HomePage() {
  let fileReader: FileReader;
  const navigate = useNavigate();
  const { readString } = usePapaParse();


  const handleFileRead = () => {
    const content = fileReader.result as string;
    const readData: any = readString(content, {header: true} as any);
    setData(readData.data);
    navigate('view');
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