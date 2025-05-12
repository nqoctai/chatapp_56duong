package org.chatapp.backend.messagecontent;

import lombok.RequiredArgsConstructor;
import org.chatapp.backend.messageroommember.MessageRoomMemberDTO;
import org.chatapp.backend.messageroommember.MessageRoomMemberService;
import org.chatapp.backend.user.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messagecontents")
public class MessageContentController {
    private final MessageContentService messageContentService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRoomMemberService messageRoomMemberService;

    @GetMapping("/{roomId}")
    public ResponseEntity<List<MessageContentDTO>> getMessageContentsByRoomId(@PathVariable final UUID roomId) {
        List<MessageContentDTO> messageContents = messageContentService.getMessageContentsByRoomId(roomId);
        return ResponseEntity.ok(messageContents);
    }

    @MessageMapping("/send-message")
    public void sendMessage(@RequestBody MessageContentDTO messageContentDTO) {
        System.out.println("Received message: " + messageContentDTO);
        final MessageContentDTO saved = messageContentService.save(messageContentDTO);
        final List<MessageRoomMemberDTO> members = messageRoomMemberService
                .findByMessageRoomId(messageContentDTO.getMessageRoomId());
        System.out.println("Found members to send message: " + members);
        members.forEach(member -> {
            String destination = "/user/" + member.getUsername() + "/queue/messages";
            System.out.println("Sending message to: " + destination);
            simpMessagingTemplate.convertAndSendToUser(
                    member.getUsername(),
                    "/queue/messages",
                    saved);
            System.out.println("Message sent to " + member.getUsername() + ", content: " + saved.getContent());
        });
    }
}
