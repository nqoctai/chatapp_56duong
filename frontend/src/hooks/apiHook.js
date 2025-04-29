import { useMutation } from "@tanstack/react-query";
import { callLogin, findMessageRoomByMembers, getOnlineUsers } from "@services/api";


export const useLogin = () => {
    return useMutation({
      mutationFn: ({ username, password }) => callLogin(username, password),
    });
  };

export const useGetOnlineUsers = () => {
    return useMutation({
      mutationFn: () => getOnlineUsers(),
    });
  };

export const useFindMessageRoomByMembers = () => {
    return useMutation({
      mutationFn: (members) => findMessageRoomByMembers(members),
    });
  }


