package com.spotifyapp.backend.dto;

import java.util.List;

public record Artist(
        String id,
        String name,
        List<String> genres,
        String imageUrl,
        String spotifyUrl
) {}
