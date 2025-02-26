import { usePapaParse } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import { DragEvent, useRef } from "react";
import { GOODREADS_FIELDS, setData } from "../Data/repo";

import { MdOutlineUploadFile } from "react-icons/md";

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  let fileReader: FileReader;
  const navigate = useNavigate();
  const { readString } = usePapaParse();

  const handleFileRead = () => {
    const content = fileReader.result as string;
    const readData: any = readString(content, {
      header: true,
      dynamicTyping: dynamicTypingFields,
    } as any);

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

  const handleChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
    } else {
      // to be fair, I have no idea when this error would ever be triggered
      console.log("INVALID FILE Try again with a different file");
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 1) {
      console.log("You may only upload one file at a time");
      return;
    }

    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(files[0]);
  };

  // handle drag events
  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="upload-page | even-columns ff-primary">
      <div className="file-input-container">
        <input
          id="file-input"
          className="visually-hidden"
          accept=".csv"
          type="file"
          onChange={handleChosen}
          ref={inputRef}
        />
        <label
          htmlFor="file-input"
          id="file-input-label"
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDrop={handleDrop}
        >
          <MdOutlineUploadFile id="file-input-symbol" />
          <span id="text-input-span">
            Drag and drop exported Goodreads library file here
          </span>
          <span id="or-input-span">OR</span>
          <button onClick={() => inputRef.current?.click()}>
            Browse Files
          </button>
        </label>
        <span id="input-privacy-notice">
          Note: Any data you upload is processed solely within your browser and
          is not stored or transmitted by us in any way. We do not retain or
          have access to your uploaded information.
        </span>
      </div>

      <div className="instructions">
        <h1>Get Started</h1>
        <p>
          Goodreads Visualiser takes your Goodreads library and finds some
          interesting statistics about your reading habits. Follow the steps below to upload your
          library and get started!
        </p>

        <ol className="flow">
          <li>
            On Goodreads, go to 'My Books' or click{" "}
            <a className="link" target="_blank" href="https://www.goodreads.com/review/list/">this link</a> and then on the side bar, click 'Import/Export.'
          </li>
          <li>
            Now click on 'Export Library.' Finally, when it appears, the generated link to download your Goodreads data.
          </li>
          <li>
            Upload the file to this page and enjoy your Goodreads visualiser!
          </li>
        </ol>
      </div>
    </div>
  );
}
