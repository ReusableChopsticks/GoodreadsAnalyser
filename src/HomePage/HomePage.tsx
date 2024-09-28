import { useState } from "react"
import { usePapaParse } from "react-papaparse";


export default function HomePage() {
  let fileReader: FileReader;
  const { readString } = usePapaParse();

  let data = {};


  const handleFileRead = () => {
    const content = fileReader.result as string;
    data = readString(content, {header: true} as any);
    console.log(data)
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

// const readStringConfig = {
//   header: true,
// }