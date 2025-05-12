package org.chatapp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue", "/user"); // Clients subscribe to /topic/**
        registry.setApplicationDestinationPrefixes("/app"); // Clients send messages to /app/**
        registry.setUserDestinationPrefix("/user"); // For user-specific destinations
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/api/ws") // Client connect to
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Thêm log để dễ debug
        System.out.println("WebSocket endpoint registered: /api/ws");
    }
}
