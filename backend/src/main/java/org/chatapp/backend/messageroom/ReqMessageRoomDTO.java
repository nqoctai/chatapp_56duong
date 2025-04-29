package org.chatapp.backend.messageroom;

import lombok.Data;

import java.util.List;


@Data
public class ReqMessageRoomDTO {
    List<String> members;
    String username;
}
