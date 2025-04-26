package org.chatapp.backend.user;


import lombok.Data;

import java.time.LocalDateTime;


@Data

public class UserDTO {
    private String username;
    private String password;
    private UserStatus status;
    private String avatarUrl;
}


