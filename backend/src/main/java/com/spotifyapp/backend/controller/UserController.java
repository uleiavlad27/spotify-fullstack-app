package com.spotifyapp.backend.controller;

import com.spotifyapp.backend.dto.Track;
import com.spotifyapp.backend.service.SpotifyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final SpotifyService spotifyService;

    public UserController(SpotifyService spotifyService){
        this.spotifyService = spotifyService;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal OAuth2User principal){
        return principal.getAttributes();
    }

    @GetMapping("/user/top-tracks")
    public List<Track> getTopTracks(
            @RegisteredOAuth2AuthorizedClient("spotify") OAuth2AuthorizedClient authorizedClient,
            @RequestParam(name = "time_range", defaultValue = "short_term") String timeRange,
            @RequestParam(name = "limit", defaultValue = "10") int limit
            ) {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        return spotifyService.getUserTopTracks(accessToken, timeRange, limit);
    }
}
