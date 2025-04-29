package org.chatapp.backend.messageroom;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messagerooms")
public class MessageRoomController {

    private final MessageRoomService messageRoomService;

    @GetMapping("/find-chat-room")
    public ResponseEntity<MessageRoomDTO> findMessageRoomByMembers(@RequestParam final List<String> members){
        return ResponseEntity.ok(messageRoomService.findMessageRoomByMembers(members));
    }

    @PostMapping("/create-chat-room")
    public ResponseEntity<MessageRoomDTO> create(@RequestBody final ReqMessageRoomDTO reqMessageRoomDTO){
        return ResponseEntity.ok(messageRoomService.create(reqMessageRoomDTO));
    }


    @GetMapping("/find-chat-room-at-least-one-content/{username}")
    public ResponseEntity<List<MessageRoomDTO>> findMessageRoomAtLeastOneContent(@PathVariable final String username){
        return ResponseEntity.ok(messageRoomService.findMessageRoomAtLeastOneContent(username));
    }
}
