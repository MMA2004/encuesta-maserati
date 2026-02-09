import './App.css'
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import MaseratiSurvey from "./pages/MaseratiSurvey.jsx";

function Inicio() {
    const navigate = useNavigate();

    const irAEncuesta = () => {
        // puedes cambiar el id por el que necesites
        navigate("/maserati/123");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Inicio</h1>
            <button onClick={irAEncuesta}>
                Ir a la encuesta
            </button>
        </div>
    );
}

export default function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/maserati/:surveyId" element={<MaseratiSurvey />} />
            </Routes>
        </BrowserRouter>

    );
}