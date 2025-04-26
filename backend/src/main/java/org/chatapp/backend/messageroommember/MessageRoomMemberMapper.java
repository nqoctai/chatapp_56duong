package org.chatapp.backend.messageroommember;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.chatapp.backend.messageroom.MessageRoom;
import org.chatapp.backend.messageroom.MessageRoomRepository;
import org.chatapp.backend.user.User;
import org.chatapp.backend.user.UserRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageRoomMemberMapper {
    private final MessageRoomRepository messageRoomRepository;
    private final UserRepository userRepository;

    public MessageRoomMemberDTO toDTO(final MessageRoomMember messageRoomMember, final MessageRoomMemberDTO messageRoomMemberDTO) {
        messageRoomMemberDTO.setMessageRoomId(messageRoomMember.getMessageRoom().getId());
        messageRoomMemberDTO.setUsername(messageRoomMember.getUser().getUsername());
        messageRoomMemberDTO.setIsAdmin(messageRoomMember.getIsAdmin());
        messageRoomMemberDTO.setLastSeen(messageRoomMember.getLastSeen());
        messageRoomMemberDTO.setLastLogin(messageRoomMember.getUser().getLastLogin());
        return messageRoomMemberDTO;
    }

    public MessageRoomMember toEntity(final MessageRoomMemberDTO messageRoomMemberDTO,final MessageRoomMember messageRoomMember ){
        final MessageRoom messageRoom = messageRoomMemberDTO.getMessageRoomId() == null ? null
                : messageRoomRepository.findById(messageRoomMemberDTO.getMessageRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Message room not found"));

        messageRoomMember.setMessageRoom(messageRoom);

        final User user = messageRoomMemberDTO.getUsername() == null ? null
                : userRepository.findById(messageRoomMemberDTO.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        messageRoomMember.setUser(user);
        messageRoomMember.setIsAdmin(messageRoomMemberDTO.getIsAdmin());
        messageRoomMember.setLastSeen(messageRoomMemberDTO.getLastSeen());

        return messageRoomMember;
    }
}
