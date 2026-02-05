package com.spotifyapp.backend.service;

import com.spotifyapp.backend.dto.Album;
import com.spotifyapp.backend.dto.Artist;
import com.spotifyapp.backend.dto.Track;
import com.spotifyapp.backend.dto.AlbumStats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SpotifyService {

    private static final Logger log = LoggerFactory.getLogger(SpotifyService.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public SpotifyService(){
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }



    // USER'S TOP TRACKS

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



                String previewUrl = null;
                if(item.has("preview_url") && !item.path("preview_url").isNull()) {
                    previewUrl = item.path("preview_url").asText();
                }
                tracks.add(new Track(name, artist, album, imageUrl, spotifyUrl, previewUrl));
            }
        }
        return tracks;
    }



    // USER'S TOP ARTISTS


    public List<Artist> getUserTopArtists(String accessToken, String timeRange, int limit){
        log.debug("Fetching top {} top artists with range: {}", limit, timeRange);

        try{
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.spotify.com")
                            .path("/v1/me/top/artists")
                            .queryParam("time_range", timeRange)
                            .queryParam("limit", String.valueOf(limit))
                            .build())
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(String.class);
            return parseArtistsFromJson(jsonResponse);
        } catch(Exception e){
            log.error("ERROR fetching artists", e);
            return List.of();
        }
    }

    public List<Artist> parseArtistsFromJson(String jsonResponse) throws Exception {
        List<Artist> artists = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonResponse);
        if(root.has("items")) {
            for(JsonNode item : root.path("items")) {

                String id = item.path("id").asText();
                String name = item.path("name").asText();

                List<String> genres = new ArrayList<>();
                if(item.has("genres") && !item.path("genres").isEmpty()) {
                    for(JsonNode genre : item.path("genres")) {
                        genres.add(genre.asText());
                    }
                }
                String imageUrl = "";
                if(item.has("images") && !item.path("images").isEmpty()){
                    imageUrl = item.path("images").get(0).path("url").asText();
                }
                String spotifyUrl = "";
                if(item.has("external_urls") && !item.path("external_urls").isEmpty()){
                    spotifyUrl = item.path("external_urls").path("spotify").asText();
                }

                artists.add(new Artist(id, name, genres, imageUrl, spotifyUrl));
            }
        }
        return artists;
    }

    // ALBUMS FROM AN ARTIST

    public List<Album> getAlbumsFromArtist(String accessToken, String artistId){
        log.debug("Fetching albums from artist with id: {}", artistId);

        try {
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.spotify.com")
                            .path("/v1/artists/" + artistId + "/albums")
                            .queryParam("limit", "50")
                            .queryParam("include_groups", "album,single")
                            .build())
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(String.class);

            return parseAlbumsFromJson(jsonResponse);
        } catch (Exception e){
            log.error("Error fetching albums from artist", e);
            return List.of();
        }
    }

    public List<Album> parseAlbumsFromJson(String jsonResponse) throws Exception{
        List<Album> albums = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonResponse);
        if(root.has("items")){
            for(JsonNode item: root.path("items")){
                String name = item.path("name").asText();

                String artist = "Unknown";
                if(item.has("artists") && !item.path("artists").isEmpty()){
                    artist = item.path("artists").get(0).path("name").asText();
                }

                String imageUrl = "";
                if(item.has("images") && !item.path("images").isEmpty()){
                    imageUrl = item.path("images").get(0).path("url").asText();
                }
                String spotifyUrl = item.path("external_urls").path("spotify").asText();

                String releaseDate = item.path("release_date").asText();

                albums.add(new Album(name, artist, imageUrl, spotifyUrl, releaseDate));
            }
        }
        return albums;
    }

    // TOP ALBUMS
    public List<AlbumStats> getTopAlbums(String accessToken, String timeRange) {
        List<Track> tracks = getUserTopTracks(accessToken, timeRange, 50);
        Map<String, List<Track>> albumsMap = tracks.stream()
                .collect(Collectors.groupingBy(Track::album));
        List<AlbumStats> topAlbums = new ArrayList<>();

        for(Map.Entry<String, List<Track>> entry : albumsMap.entrySet()) {
            List<Track> tracksInAlbum = entry.getValue();
            Track firstTrack = tracksInAlbum.get(0);
            topAlbums.add(new AlbumStats(
                    firstTrack.album(),
                    firstTrack.artist(),
                    firstTrack.imageUrl(),
                    firstTrack.spotifyUrl(),
                    tracksInAlbum.size()
            ));
        }
        topAlbums.sort((a, b) -> Long.compare(b.trackCount(), a.trackCount()));
        return topAlbums;
    }



}
