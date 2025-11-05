import HomePage from "../pages/homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ManagerPage from "../pages/ManagerPage";
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="request" element={<HomePage />} />
                <Route path="manager" element={<ManagerPage />} />

            </Routes>
        </BrowserRouter>
    )
}