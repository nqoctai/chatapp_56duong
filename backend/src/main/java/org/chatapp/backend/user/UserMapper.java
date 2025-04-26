package org.chatapp.backend.user;


import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.RequiredArgsConstructor;
import org.chatapp.backend.messageroom.MessageRoom;
import org.chatapp.backend.messageroommember.MessageRoomMember;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserMapper {
    public UserDTO toDTO(final User user, final UserDTO userDTO) {
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setStatus(user.getStatus());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        return userDTO;
    }

    public User toEntity(final UserDTO userDTO,final User user ){


//        private String username;
//        private String password;
//        private UserStatus status;
//        private LocalDateTime lastLogin = LocalDateTime.now();
//        private String avatarUrl;
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setStatus(userDTO.getStatus());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setLastLogin(LocalDateTime.now());


        return user;
    }
}
