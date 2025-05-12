import axios from '../utils/axios-customize';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// Auth API services
export const callLogin = (username, password) => {
    return axios.post('api/v1/users/login', { username, password });
};

// Get all online users
export const getOnlineUsers = async () => {
    try {
        const response = await axios.get('api/v1/users/online');
        return response;
    } catch (error) {
        console.error('Error fetching online users:', error);
        return [];
    }
};

// Search users by username
export const getUserByUsername = async (username) => {
    try {
        const response = await axios.get(`api/v1/users/search/${username}`);
        return response;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        return null;
    }
};

export const findMessageRoomByMembers = async (members) => {
    try {
        const response = await axios.get(`api/v1/messagerooms/find-chat-room?members=${members}`);
        return response;
    } catch (error) {
        console.error('Error fetching message room by members:', error);
        return null;
    }
}

export const createChatRoom = async (currentUsername, members) => {
    try {
        const response = await axios.post(`api/v1/messagerooms/create-chat-room`, {
            username: currentUsername,
            members: [ ...members],
        });
        return response;
    } catch (error) {
        console.error('Error creating chat room:', error);
        return null;
    }
}

export const findMessageRoomAtLeastOneContent = async (username) => {
    try {
        const response = await axios.get(`api/v1/messagerooms/find-chat-room-at-least-one-content/${username}`);
        return response;
    } catch (error) {
        console.log("Error fetching message room with at least one content:", error);
        return null;
    }
}

// Message Content API services
export const getMessageContentsByRoomId = async (roomId) => {
    try {
        const response = await axios.get(`api/v1/messagecontents/${roomId}`);
        return response || []; // API trả về một mảng các MessageContentDTO
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

// WebSocket connection setup
let stompClient = null;
let subscriptionMessages = null;

export const connectWebSocket = (username) => {
    const socket = new SockJS('http://localhost:8080/api/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, () => {
        console.log('Connected to WebSocket');
        subscribeMessages(username);
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });
};

const subscribeMessages = (username) => {
    subscriptionMessages = stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        // Emit message to any listeners
        if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('newMessage', { detail: receivedMessage }));
        }
    });
};

export const disconnectWebSocket = () => {
    if (subscriptionMessages) {
        subscriptionMessages.unsubscribe();
    }
    if (stompClient !== null) {
        stompClient.disconnect(() => {
            console.log('WebSocket disconnected');
        });
    }
};

export const sendMessage = (message) => {
    if (stompClient && stompClient.connected) {
        const messageToSend = {
            content: message.content,
            messageRoomId: message.messageRoomId,
            sender: message.senderUsername,
            messageType: "TEXT", // Đặt mặc định là TEXT
            // dateSent sẽ được thiết lập ở phía server
        };
        console.log("Gửi tin nhắn:", messageToSend);
        stompClient.send("/app/send-message", {}, JSON.stringify(messageToSend));
        return true;
    }
    return false;
};






