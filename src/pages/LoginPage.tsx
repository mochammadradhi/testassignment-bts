import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { loginUser } from "@/redux/features/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/redux/store";

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      });
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 border rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <div>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-500 text-sm">{formik.errors.username}</p>
          )}
        </div>

        <div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error.errorMessage}</p>}

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
