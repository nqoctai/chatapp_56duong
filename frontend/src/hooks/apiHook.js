import { useMutation } from "@tanstack/react-query";
import { callLogin } from "@services/api";


export const useLogin = () => {
    return useMutation({
      mutationFn: ({ username, password }) => callLogin(username, password),
    });
  };