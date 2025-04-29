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
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (formData) => {
    mutate(
      { username: formData.username, password: formData.password },
      {
        onSuccess: (data) => {
          console.log("Login successful", data);
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: data.username,
              avatarUrl: data.avatarUrl,
            }),
          );
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
          name={"username"}
          label={"Username"}
          control={control}
          Component={TextInput}
          error={errors["username"]}
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
