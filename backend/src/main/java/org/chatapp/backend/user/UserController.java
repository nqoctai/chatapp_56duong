package org.chatapp.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody final UserDTO userDTO){
            return ResponseEntity.ok(userService.login(userDTO));
    }

    @MessageMapping("/user/connect") // Receives message from the client sending to /app/user/connect
    @SendTo("/topic/active") // Sends message to the client subscribing to /topic/active
    public UserDTO connect(@RequestBody UserDTO userDTO){
        return userService.connect(userDTO);
    }

    @MessageMapping("/user/disconnect") // Receives message from the client sending to /app/user/disconnect
    @SendTo("/topic/active") // Sends message to the client subscribing to /topic/active
    public UserDTO disconnect(@RequestBody UserDTO userDTO){
        return userService.logout(userDTO.getUsername());
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserDTO>> getOnlineUsers() {
        return ResponseEntity.ok(userService.getOnlineUsers());
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<List<UserDTO>> searchUsersByUsername(@PathVariable final String username) {
        return ResponseEntity.ok(userService.searchUsersByUsername(username));
    }
}
