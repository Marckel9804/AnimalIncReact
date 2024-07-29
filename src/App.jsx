import "./App.css";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./login/Login.jsx";

function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    </>
  );
}

export default App;
