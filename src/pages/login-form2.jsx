import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { AuthContext } from "@/routes/AuthProvider";

export default function LoginForm2() {
    // dùng email + password cho đúng với form
    const [formData, setFormData] = useState({ username: "", password: "" });
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // demo: login bằng email cho khớp
        const result = await auth.login({
            username: formData.username.trim(),
            password: formData.password,
        });

        if (result.ok) {
            // có thể điều hướng dựa trên role nếu muốn
            navigate("/", { replace: true });
        }

    };

    const canSubmit = formData.username.trim() && formData.password.trim();

    return (
        <Box sx={{ maxWidth: 560, mx: "auto", mt: 6, px: 2 }}>
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Username"
                            name="username"
                            type="username"
                            variant="outlined"           // ép dùng outlined cho đẹp
                            fullWidth
                            margin="normal"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"           // đồng nhất với trên
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 2, textTransform: "none" }} // tắt UPPERCASE
                            disabled={!canSubmit}
                        >
                            Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
