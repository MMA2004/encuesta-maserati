import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaseratiSurvey from "./pages/MaseratiSurvey.jsx";
export default function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/maserati/:surveyId" element={<MaseratiSurvey />} />
            </Routes>
        </BrowserRouter>

    );
}