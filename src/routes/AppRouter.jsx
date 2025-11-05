import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";

import ManagerPage from "../pages/ManagerPage";
import { MyRequests } from "../pages/MyRequests";
import { CreateLeaveRequest } from "@/pages/CreateLeaveRequest";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="manager" element={<ManagerPage />} />
        <Route path="request" element={<CreateLeaveRequest/>}/>
      </Routes>
    </BrowserRouter>
  );
}
