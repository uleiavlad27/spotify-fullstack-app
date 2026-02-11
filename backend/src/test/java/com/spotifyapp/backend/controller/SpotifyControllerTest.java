package com.spotifyapp.backend.controller;

import com.spotifyapp.backend.service.SpotifyService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SpotifyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SpotifyService spotifyService;

    // --- TEST 1: User Profile (/api/me) ---
    @Test
    @DisplayName("Test /api/me --- return ")
    void shouldReturnCurrentUser() throws Exception {
        mockMvc.perform(get("/api/me")
                .with(oauth2Login().attributes(attrs -> {
                    attrs.put("display_name", "Test User");
                    attrs.put("email", "test@test.com");
                })))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.display_name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@test.com"));
    }

    @Test
    @DisplayName("Test /api/user/top-tracks")
    void shouldReturnTopTracks() throws Exception {
        when(spotifyService.getUserTopTracks(anyString(), anyString(), anyInt(), anyInt()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(
                get("/api/user/top-tracks")
                        .with(oauth2Login())
                        .param("time_range", "medium")
                        .param("limit", "10")
                        .param("offset", "0"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Test /api/user/top-artists")
    void shouldReturnTopArtist() throws Exception {
        when(spotifyService.getUserTopArtists(anyString(), anyString(), anyInt(), anyInt()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(
                get("/api/user/top-artists")
                        .with(oauth2Login())
                        .param("time_range", "medium")
                        .param("limit", "0")
                        .param("offset", "0"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Test /api/artist/{artistId}/albums")
    void shouldReturnArtistsAlbums() throws Exception {

        when(spotifyService.getAlbumsFromArtist(anyString(),anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(
                get("/api/artist/1234/albums")
                        .with(oauth2Login()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Test /user/top-albums")
    void shouldReturnTopAlbums() throws Exception {
        when(spotifyService.getTopAlbums(anyString(), anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(
                get("/api/user/top-albums")
                        .with(oauth2Login())
                        .param("time_range", "short_term"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }


    @Test
    @DisplayName("Any API call")
    void shouldReject_WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/user/top-tracks"))
                .andExpect(status().isUnauthorized());
    }
}