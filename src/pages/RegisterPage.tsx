import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RootState, AppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { name, email, password } = values;
      dispatch(registerUser({ name, email, password })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate("/login");
        }
      });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 border rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <div>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="underline text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
