import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { GOODREADS_FIELDS, setData } from "../Data/repo";

import "./HomePage.css";

const dynamicTypingFields = {
  "Number of Pages": true,
  "My Rating": true,
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

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
    }
  };

  function dropHandler(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("FILE DROPPED");
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      console.log(files[i] instanceof File);
      console.log(files[i]);
    }
  }

  // handle drag events
  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="upload-page | even-columns">
      
        {/* <img src={imgthing} alt="" /> */}
        <input
          id="file-input"
          className="visually-hidden"
          accept=".csv"
          type="file"
          onChange={handleFileChosen}
        />

        <label 
          htmlFor="file-input" 
          id="file-input-label"
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDrop={dropHandler}
        >
          <span>Drag and drop file here</span>
        </label>

      <div className="instructions-content">
        <h1>Get Started</h1>
      </div>
    </div>
  );
}

import imgthing from "/HomeLogo.png";
import { DragEvent } from "react";
