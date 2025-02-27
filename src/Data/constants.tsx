export const PAGE_HEIGHT_M = 0.00007; // in meters
export const PX_PER_MM = 0.000026;
export const PX_PER_PAGE = PX_PER_MM / PAGE_HEIGHT_M;

type HeightComparisonObject = { height: number, name: string, description: string }

export const HEIGHT_COMPARISONS: HeightComparisonObject[] = [
  { height: 0.22, name: "Soccer Ball", description: "The diameter of a standard size 5 soccer ball" },
  { height: 0.55, name: "Shortest Person Recorded", description: "Chandra Bahadur Dangi holds the title of the world's shorted human adult ever documented" },
  { height: 0.76, name: "Acoustic Guitar", description: "The length of a standard acoustic guitar" },
  { height: 1.2, name: "Lion", description: "A large wild cat" },
  { height: 1.7, name: "Human", description: "An average adult human" },
  { height: 2.5, name: "Sunflower", description: "A tall flowering plant" },
  { height: 5.8, name: "Giraffe", description: "The tallest living terrestrial animal. The tallest recorded giraffe was named George and grew to be 5.8m tall." },
  { height: 13, name: "Brachiosaurus", description: "A genus of sauropod dinosaur that lived in North America during the Late Jurassic, about 154–153 million years ago" },
  { height: 20.6, name: "Flinders Street Railway Station", description: "The height of Melbourne's most iconic train station" },
  { height: 30, name: "Christ the Redeemer", description: "The height of the statue itself" },
  { height: 48, name: "Colosseum", description: "The height of the outer wall of the Colosseum in central Rome" },
  { height: 57, name: "The Leaning Tower of Pisa", description: "The height of the Leaning Tower of Pisa" },
  { height: 67, name: "Sydney Opera House", description: "The height of the tallest point of the structure, equivalent to the height of a 22-storey building" },
  { height: 93, name: "Statue of Liberty", description: "A colossal neoclassical sculpture on Liberty Island" },
  { height: 116, name: "Tallest Tree", description: "The tallest tree in the world is a coast redwood (Sequoia sempervirens), named Hyperion. It was discovered in 2006 and is 116m tall." },
  { height: 135, name: "London Eye", description: "A giant Ferris wheel on the South Bank of the River Thames in London. Also known as the Millennium Wheel, its official name was originally the British Airways London Eye, then the Merlin Entertainments London Eye, and since January 2011, the EDF Energy London Eye." },
];

// the upper bound for library height according to what I found on Goodreads is about 187m!!!! these people are insane
// this being Sandra's library which has 5564 books read!!!!!!!!!
// https://www.goodreads.com/user/show/2650335