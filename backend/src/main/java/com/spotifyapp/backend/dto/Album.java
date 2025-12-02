package com.spotifyapp.backend.dto;

public record Album(
     String name,
     String artist,
     String imageUrl,
     String spotifyUrl,
     String releaseDate
) {}
