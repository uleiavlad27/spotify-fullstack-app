package com.spotifyapp.backend.dto;

public record AlbumStats(
        String albumName,
        String artist,
        String imageUrl,
        String spotifyUrl,
        long trackCount
) {}
