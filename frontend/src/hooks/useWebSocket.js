import { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const webSocketUrl = import.meta.env.VITE_BASE_URL + "api/ws";

export function useWebSocket(user) {
    const [activeUser, setActiveUser] = useState(null);
    const stompClient = useRef(null);
  
    useEffect(() => {
      if (!user) return;
  
      const socket = new SockJS(webSocketUrl);
      const client = Stomp.over(socket);
  
      client.connect(
        {},
        () => {
          // Kết nối thành công
          subscribeActive(client);
          sendConnect(client, user);
        },
        (error) => {
          console.error('WebSocket connection error:', error);
        }
      );
  
      stompClient.current = client;
  
      return () => {
        if (stompClient.current) {
          stompClient.current.disconnect(() => {
            console.log('WebSocket disconnected');
          });
        }
      };
    }, [user]);
  
    const subscribeActive = (client) => {
      client.subscribe('/topic/active', (message) => {
        const activeUser = JSON.parse(message.body);
        console.log('Active user received:', activeUser);
        setActiveUser(activeUser);
      });
    };
  
    const sendConnect = (client, user) => {
      client.send('/app/user/connect', {}, JSON.stringify(user));
    };
  
    return { activeUser };
  }