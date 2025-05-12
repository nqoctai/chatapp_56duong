package org.chatapp.backend.messagecontent;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageContentService {
    private final MessageContentRepository messageContentRepository;
    private final MessageContentMapper messageContentMapper;

    public MessageContentDTO getLastMessage(final UUID messageRoomId) {
        return messageContentRepository.findTopByMessageRoomIdOrderByDateSentDesc(messageRoomId)
                .map(messageContent -> messageContentMapper.toDTO(messageContent, new MessageContentDTO()))
                .orElse(null);
    }

    public List<MessageContentDTO> getMessageContentsByRoomId(final UUID roomId) {
        return messageContentRepository.findByMessageRoomIdOrderByDateSent(roomId)
                .stream()
                .map(m -> messageContentMapper.toDTO(m, new MessageContentDTO()))
                .toList();
    }

    public MessageContentDTO save(final MessageContentDTO messageContentDTO) {
        final MessageContent messageContent = messageContentMapper.toEntity(messageContentDTO, new MessageContent());
        return messageContentMapper.toDTO(messageContentRepository.save(messageContent), new MessageContentDTO());
    }
}
