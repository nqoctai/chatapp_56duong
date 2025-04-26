import TextInput from "@components/FormInput.jsx/TextInput";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";

import { useLogin } from "@hooks/apiHook";

import FormField from "@components/FormField";
import { Alert, Button } from "@mui/material";

const LoginPage = () => {
  const { mutate, isLoading, error, data } = useLogin();

  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formData) => {
    mutate(
      { username: formData.email, password: formData.password },
      {
        onSuccess: (data) => {
          console.log("Login successful", data);
          localStorage.setItem("user", data);
          navigate("/");
        },
        onError: (error) => {
          console.log("Login failed", error);
        },
      },
    );
    console.log("data >>>", data);
  };

  return (
    <div>
      <p className="mb-5 text-center text-2xl font-bold">Login</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name={"email"}
          label={"Email"}
          control={control}
          Component={TextInput}
          error={errors["email"]}
        />
        <FormField
          name={"password"}
          label={"Password"}
          control={control}
          type="password"
          Component={TextInput}
          error={errors["password"]}
        />
        <Button variant="contained" type="submit">
          {isLoading && <CircularProgress size={"16px"} className="mr-1" />}
          Sign In
        </Button>
        {error && <Alert severity="error">{error?.response?.data.error}</Alert>}
      </form>
      <p className="mt-4">
        New on our platform?{" "}
        <Link className="font-bold" to={"/register"}>
          Create an account?
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
