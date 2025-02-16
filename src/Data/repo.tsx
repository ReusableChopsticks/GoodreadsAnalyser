const DATA_KEY = 'data'

export interface GoodreadsDataField {
  "Book Id": number;
  "Title": string;
  "Author": string;
  "Author l-f": string;
  "Additional Authors": string;
  "ISBN": string;
  "ISBN13": string;
  "My Rating": number; // Unrated books are 0. Otherwise, range is [1, 5]
  "Average Rating": number;
  "Publisher": string;
  "Binding": string;
  "Number of Pages": number;
  "Year Published": number;
  "Original Publication Year": number;
  "Date Read": Date;
  "Date Added": Date;
  "Bookshelves": string;
  "Bookshelves with positions": string;
  "Exclusive Shelf": string;
  "My Review": string;
  "Spoiler": string;
  "Private Notes": string;
  "Read Count": number;
  "Owned Copies": number;
}

export const GOODREADS_FIELDS = [
  "Book Id",
  "Title",
  "Author",
  "Author l-f",
  "Additional Authors",
  "ISBN",
  "ISBN13",
  "My Rating",
  "Average Rating",
  "Publisher",
  "Binding",
  "Number of Pages",
  "Year Published",
  "Original Publication Year",
  "Date Read",
  "Date Added",
  "Bookshelves",
  "Bookshelves with positions",
  "Exclusive Shelf",
  "My Review",
  "Spoiler",
  "Private Notes",
  "Read Count",
  "Owned Copies"
]

const setData = (data: GoodreadsDataField[]): void => {
  localStorage.setItem(DATA_KEY, JSON.stringify(processData(data)));
}
const getData = (): GoodreadsDataField[] => {
  const data = localStorage.getItem(DATA_KEY);
  if (data) {return JSON.parse(data)} else {return []}
}
const clearData = (): void => {
  localStorage.setItem(DATA_KEY, '[]');
}

/**
 * 
 * @param data an array of goodreads fields
 * @returns the same array but titles are cleaned
 */
const processData = (data: GoodreadsDataField[]) => {  
  let processed = data;

  // for some reason, papaparse(?) always adds a blank object at the end of the array so remove it if its there
  if (!processed.at(-1)!["Book Id"]) {
    processed = processed.slice(0, -1);
  }

  // process the title: remove brackets and colons
  processed = processed.map(field => {
    // Use regular expression to match everything after '(' or ':' and remove it
    const cleanedTitle = field.Title.replace(/[:\(].*$/, '').trim();
    console.log(cleanedTitle);

    // Return a new object with the cleaned title while preserving other properties
    return {
      ...field,
      Title: cleanedTitle
    };
  });

  console.log(processed);

  return processed;
}


export {
  setData,
  getData,
  clearData,
  processData,
}