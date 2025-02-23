import { ChangeEvent } from "react";

export default function ScrapsPage() {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
      }
    }
  }

  return (
    <>
      <input 
        multiple={true}
        type="file" 
        onChange={handleChange}
      />

    </>
  )
}

// you're all i need... you're all i need...
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications