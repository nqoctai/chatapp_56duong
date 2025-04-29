import axios from '../utils/axios-customize';

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






