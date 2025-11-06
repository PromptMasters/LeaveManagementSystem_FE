import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/routes/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

type Props = {
    onSubmit?: (data: { username: string; password: string; remember: boolean }) => Promise<void> | void;
    loading?: boolean;          // quản lý loading từ ngoài (optional)
    error?: string | null;      // lỗi từ ngoài (optional)
    title?: string;
};

export default function LoginForm({
    onSubmit,
    loading,
    error,
    title = "Đăng nhập",
}: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const [data, setData] = useState<any>(null);
    // local loading & error (khi không truyền từ ngoài)
    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const isLoading = loading ?? submitting;
    const externalError = typeof error === "string" && error.trim() !== "" ? error : null;
    const displayError = externalError ?? localError;

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        setLocalError(null);
        setSubmitting(true);

        try {
            const result = await auth.login({
                username: username.trim(),
                password,
            });

            let data: any;

            // 🔍 Nếu auth.login() trả về raw Response, parse JSON
            if (result && typeof result.json === "function") {
                data = await result.json();
            } else {
                data = result; // đã là JSON object
            }

            console.log("✅ data:", data);

            if (!data) {
                setLocalError("Không nhận được phản hồi từ máy chủ.");
                return;
            }

            if (!data.ok && !data.role) {
                setLocalError(data.message || "Sai tài khoản hoặc mật khẩu.");
                return;
            }

            // ✅ Bây giờ chắc chắn có data.role
            console.log("User role:", data.user.role);

            if (data.user.role === "ROLE_MANAGER") navigate("/manager", { replace: true });
            else navigate("/", { replace: true });
        } catch (err: any) {
            console.error("lỗi 2", err);
            setLocalError(err?.message || "Có lỗi xảy ra khi đăng nhập.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen grid place-items-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
            <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none" aria-hidden>
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl"
                    style={{ background: "radial-gradient(closest-side, hsl(var(--primary)/0.35), transparent)" }} />
                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl"
                    style={{ background: "radial-gradient(closest-side, hsl(var(--accent)/0.35), transparent)" }} />
            </div>

            <Card
                className="w-[95%] sm:w-[420px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 backdrop-blur"
                style={{ boxShadow: "var(--shadow-elevated)", borderRadius: "var(--radius)" }}
            >
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Chào mừng trở lại 👋 Hãy đăng nhập để tiếp tục.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="you@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-[hsl(var(--background))] placeholder:text-[hsl(var(--muted-foreground))]"
                                required
                                autoComplete="username"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10 bg-[hsl(var(--background))]"

                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((v) => !v)}
                                    className="absolute inset-y-0 right-0 px-3 grid place-items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition"
                                    aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    disabled={isLoading}
                                >
                                    {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {displayError != null ? (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="text-sm rounded-md p-3 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-center"
                            >
                                {displayError || "Đã xảy ra lỗi."}
                            </div>

                        ) : null}

                        <Button
                            type="submit"
                            className="w-full gap-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                            style={{ borderRadius: "calc(var(--radius) - 2px)" }}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
