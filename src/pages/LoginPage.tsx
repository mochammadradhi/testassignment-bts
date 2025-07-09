import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "..//components/ui/button";
import { Input } from "..//components/ui/input";
import type { RootState, AppDispatch } from "@/redux/store";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 p-6 border rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="underline text-blue-600">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
