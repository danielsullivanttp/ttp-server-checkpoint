let careNotes = [
  { id: 1, plantId: 1, note: "Needs water every 2 weeks." },
  { id: 2, plantId: 1, note: "Tolerates low light well." },
  { id: 3, plantId: 3, note: "Loves humidity." },
];

let nextNoteId = 4;

let plants = [
  {
    id: 1,
    name: "Snake Plant",
    type: "Succulent",
    sunlight: "Low",
    watered: true,
  },
  { id: 2, name: "Pothos", type: "Vine", sunlight: "Medium", watered: false },
  {
    id: 3,
    name: "Monstera",
    type: "Tropical",
    sunlight: "Medium",
    watered: true,
  },
  {
    id: 4,
    name: "Cactus",
    type: "Succulent",
    sunlight: "High",
    watered: false,
  },
];

let nextId = 5;

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Plants API is running!"));
app.get("/api/plants", (req, res) => {
  console.log(req.query); // <-- this is the hint they told you to try

  if (req.query.type) {
    const filtered = plants.filter((plant) => plant.type.toLowerCase() === req.query.type.toLowerCase());
    return res.json(filtered);
  }

  res.json(plants);
});

// Explain: What is the difference between req.params and req.query? Give one example of when you would use each one.
// req.params gives values based on the URL path(part of the URL) while req.query gives values based on the query string (after the ?)
// Use req.params when the route depends on the value and req.query when it does not 
// If I put a path in withouth the .params the page will not load at all, 
// but if I put the URL in without a .query, as long as it is the proper URL, the page will just load normally

app.get("/api/plants/:id", async (req, res) => {
  const plant = plants.find((plant) => plant.id === Number(req.params.id));

  if (!plant) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return res.status(404).send("Plant Not Found!!!");
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  res.json(plant);
});
// Explain: req.params.id is always a string. Why do you need to wrap it in Number() before comparing it to a plant's id?
// Because === is type specific and if the types being compared are different even if they are the same number the condition will return false
// Explain: What happens if you remove await from in front of the delay? Does the route still work the same way?
// No, The route will still work, but it will no longer wait for the promise it will just run immediately

app.get("/api/plants/:plantId/notes", (req, res) => {
  const plantId = Number(req.params.plantId);
    
  const plant = plants.find((plant) => plant.id === plantId);

  if (!plant) {
    return res.status(404).send("Plant Not Found!!!");
  }
  
  const note = careNotes.filter((note) => note.plantId === plantId);
  res.json(note);

  // Explain: What does :plantId represent in this URL? Why is it a param, and notes isn't?
  // plantId represents the car note with the same Id as the plant whose Id matches. 
  // It is a parameter and note is not because the number is dynamic and changes and the notes is static and will always say the word note.
  // ex: api/plants/2/note, 
  //     api/plants/3/note,
  //     api/plants/4/note
});

app.post("/api/plants/", (req, res) => {
  const { name, type, sunlight, watered } = req.body;
  const newPlant = {
    id: nextId,
    name,
    type,
    sunlight,
    watered,
  };
  nextId++;
  plants.push(newPlant);
  res.status(201).json(newPlant);
});

app.post("/api/plants/:plantId/notes", (req, res) => {
  const { note } = req.body;
  const newCareNote = {
    id: nextNoteId,
    note
  };
  nextNoteId++;
  careNotes.push(newCareNote);
  res.status(201).json(newCareNote);
});

app.patch("/api/plants/:id", (req, res) => {
  const plant = plants.find((plant) => plant.id === Number(req.params.id));
  if (!plant) return res.status(404).send("Plant Not Found!!!");
  Object.assign(plant, req.body);
  res.status(200).json(plant);
});

// Explain: Why does PATCH copy fields onto the plant, instead of replacing the whole plant?
// Because PATCH is meant for partial updates. Object.assign(plant, req.body) only assigns the requested fields and leaves the rest unchanged.

app.delete("/api/plants/:id", (req, res) => {
  const plant = plants.find((plant) => {
    return plant.id === Number(req.params.id);
  });
 
  if (!plant) return res.status(404).send("Plant Not Found!!!");
    
  const index = plants.indexOf(plant);
  plants.splice(index, 1);
  res.status(200).send("Object was deleted successfully!!!");
  res.status(202).end();
});

app.listen(8080, () => console.log("Server running on port 8080"));
