import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SaveProfile from "./SaveProfile"; // Note: Renamed component to SaveProfile for consistency
import SavedDogs from "./SaveDogs"; // Import SavedDogs component
import EditDog from "./EditDog"; // Import EditDog component
import "./style/index.css";



const App = () => {
  const [notes, setNotes] = useState([]); // Holds all saved dog profiles

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SaveProfile notes={notes} setNotes={setNotes} />} />
        <Route path="/saved-dogs" element={<SavedDogs notes={notes} />} /> {/* Route for SavedDogs */}
        <Route path="/edit-dog/:id" element={<EditDog notes={notes} setNotes={setNotes} />} /> {/* Route for EditDog */}
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
