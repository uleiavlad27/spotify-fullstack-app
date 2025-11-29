package com.spotifyapp.backend.dto;

public record Track(
        String name,
        String artist,
        String album,
        String imageUrl,
        String spotifyUrl
) {
}
