package com.spotifyapp.backend.service;

import com.spotifyapp.backend.dto.Track;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpotifyService {

    private static final Logger log = LoggerFactory.getLogger(SpotifyService.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public SpotifyService(){
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public List<Track> getUserTopTracks(String accessToken, String timeRange, int limit){
        log.debug("Fetching top {} tracks with range: {}", limit, timeRange);

        try{
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.spotify.com")
                            .path("/v1/me/top/tracks")
                            .queryParam("time_range", timeRange)
                            .queryParam("limit", String.valueOf(limit))
                            .build())
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(String.class);

            return parseTracksFromJson(jsonResponse);
        } catch (Exception e){
            log.error("Failed to fetch top tracks", e);
            return List.of();
        }
    }

    public List<Track> parseTracksFromJson(String jsonResponse) throws Exception {
        List<Track> tracks = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonResponse);
        if(root.has("items")) {
            for(JsonNode item : root.path("items")) {
                String name = item.path("name").asText();

                String artist = "Unknown";
                if(item.has("artists") && !item.path("artists").isEmpty()){
                    artist = item.path("artists").get(0).path("name").asText();
                }

                String album = item.path("album").path("name").asText();

                String imageUrl = "";
                if(item.path("album").has("images") && !item.path("album").path("images").isEmpty()){
                    imageUrl = item.path("album").path("images").get(0).path("url").asText();
                }

                String spotifyUrl = item.path("external_urls").path("spotify").asText();

                tracks.add(new Track(name, artist, album, imageUrl, spotifyUrl));
            }
        }
        return tracks;
    }
}
