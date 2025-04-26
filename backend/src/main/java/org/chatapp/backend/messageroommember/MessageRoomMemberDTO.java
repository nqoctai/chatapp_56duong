package org.chatapp.backend.messageroommember;


import lombok.Data;
import org.chatapp.backend.messageroom.MessageRoom;

import java.time.LocalDateTime;
import java.util.UUID;


@Data

public class MessageRoomMemberDTO {

    private UUID messageRoomId;


    private String username;


    private Boolean isAdmin;

    private LocalDateTime lastSeen;
    private LocalDateTime lastLogin;

}
