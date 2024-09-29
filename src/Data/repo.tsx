const DATA_KEY = 'data'

export interface GoodreadsDataField {
  "Book Id": number;
  "Title": string;
  "Author": string;
  "Author l-f": string;
  "Additional Authors": string;
  "ISBN": string;
  "ISBN13": string;
  "My Rating": number;
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

const setData = (data: GoodreadsDataField[]): void => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}
const getData = (): GoodreadsDataField[] => {
  const data = localStorage.getItem(DATA_KEY);
  if (data) {return JSON.parse(data)} else {return []}
}
const clearData = (): void => {
  localStorage.setItem(DATA_KEY, '[]');
}

export {
  setData,
  getData,
  clearData
}