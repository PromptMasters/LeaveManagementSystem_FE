import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";

import ManagerPage from "../pages/ManagerPage";
import { CreateLeaveRequest } from "@/pages/CreateLeaveRequest";
import AuthProvider from "./AuthProvider";
import LoginForm from "@/pages/login-form";
import LoginForm2 from "@/pages/login-form2";
export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route path="/" element={<HomePage />} />
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="login-test" element={<LoginForm2/>}/>

                    <Route path="manager" element={<ManagerPage />} />
                    <Route path="request" element={<CreateLeaveRequest />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
