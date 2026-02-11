package com.spotifyapp.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spotifyapp.backend.dto.Album;
import com.spotifyapp.backend.dto.AlbumStats;
import com.spotifyapp.backend.dto.Artist;
import com.spotifyapp.backend.dto.Track;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restclient.test.autoconfigure.RestClientTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RestClientTest(SpotifyService.class)
class SpotifyServiceTest {

    @Autowired
    private SpotifyService spotifyService;

    @Autowired
    private MockRestServiceServer mockServer;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }

    private static final String QOTSA_TRACKS = """
                {
                  "items": [
                    {
                      "name": "No One Knows",
                      "artists": [{"name": "Queens of the Stone Age"}],
                      "album": { "name": "Songs for the Deaf", "images": [{"url": "https://qotsa.com/cover.jpg"}] },
                      "external_urls": {"spotify": "https://spotify.com/track/qotsa1"},
                      "preview_url": "http://preview.url/qotsa"
                    },
                    {
                      "name": "Go With the Flow",
                      "artists": [{"name": "Queens of the Stone Age"}],
                      "album": { "name": "Songs for the Deaf", "images": [{"url": "https://qotsa.com/cover.jpg"}] },
                      "external_urls": {"spotify": "https://spotify.com/track/qotsa2"},
                      "preview_url": "http://preview.url/qotsa2"
                    }
                  ]
                }
            """;

    private static final String KNOCKED_LOOSE_ARTISTS = """
                {
                  "items": [
                    {
                      "id": "kl_id_1",
                      "name": "Knocked Loose",
                      "genres": ["metalcore", "hardcore punk"],
                      "images": [{"url": "https://kl.com/band.jpg"}],
                      "external_urls": {"spotify": "https://spotify.com/artist/kl"}
                    }
                  ]
                }
            """;

    private static final String QOTSA_ALBUMS = """
        {
          "items": [
            {
              "name": "Songs for the Deaf",
              "artists": [{"name": "Queens of the Stone Age"}],
              "images": [{"url": "http://cover.jpg"}],
              "external_urls": {"spotify": "http://sp.url"},
              "release_date": "2002-08-27"
            },
            {
              "name": "Rated R",
              "artists": [{"name": "Queens of the Stone Age"}],
              "images": [{"url": "http://cover2.jpg"}],
              "external_urls": {"spotify": "http://sp.url2"},
              "release_date": "2000-06-06"
            }
          ]
        }
    """;

    private static final String MIXED_TRACKS = """
        {
          "items": [
            {
              "name": "No One Knows",
              "artists": [{"name": "Queens of the Stone Age"}],
              "album": { "name": "Songs for the Deaf", "images": [{"url": "img1"}] },
              "external_urls": {}
            },
            {
              "name": "Go With the Flow",
              "artists": [{"name": "Queens of the Stone Age"}],
              "album": { "name": "Songs for the Deaf", "images": [{"url": "img1"}] },
              "external_urls": {}
            },
            {
              "name": "Deep in the Willow",
              "artists": [{"name": "Knocked Loose"}],
              "album": { "name": "You Won't Go Before You're Supposed To", "images": [{"url": "img2"}] },
              "external_urls": {}
            }
          ]
        }
    """;

    private static final String EMPTY_ITEMS= "{ \"items\": [] }";

    @Test
    void shouldReturnUserTopTracks_QueensOfTheStoneAge() {
        mockServer.expect(requestTo(containsString("/v1/me/top/tracks")))
                .andRespond(withSuccess(QOTSA_TRACKS, MediaType.APPLICATION_JSON));

        List<Track> tracks = spotifyService.getUserTopTracks("token", "long", 10, 0);

        assertThat(tracks).hasSize(2);
        assertThat(tracks.get(0).name()).isEqualTo("No One Knows");
        assertThat(tracks.get(0).artist()).isEqualTo("Queens of the Stone Age");
        assertThat(tracks.get(1).name()).isEqualTo("Go With the Flow");
    }

    @Test
    void shouldReturnUserTopArtists_KnockedLoose() {
        mockServer.expect(requestTo(containsString("/v1/me/top/artists")))
                .andRespond(withSuccess(KNOCKED_LOOSE_ARTISTS, MediaType.APPLICATION_JSON));

        List<Artist> artists = spotifyService.getUserTopArtists("token", "medium", 5, 0);

        assertThat(artists).hasSize(1);
        assertThat(artists.get(0).name()).isEqualTo("Knocked Loose");
        assertThat(artists.get(0).genres()).contains("metalcore");
    }

    @Test
    void shouldReturnAlbumsFromArtist_QOTSA() {
        mockServer.expect(requestTo(containsString("/v1/artists/qotsa_id/albums")))
                .andRespond(withSuccess(QOTSA_ALBUMS, MediaType.APPLICATION_JSON));

        List<Album> albums = spotifyService.getAlbumsFromArtist("token", "qotsa_id");

        assertThat(albums).hasSize(2);
        assertThat(albums.get(0).name()).isEqualTo("Songs for the Deaf");
        assertThat(albums.get(1).name()).isEqualTo("Rated R");
    }

    @Test
    void shouldCalculateTopAlbums_AndSortByCount() {
        mockServer.expect(requestTo(containsString("/v1/me/top/tracks")))
                .andRespond(withSuccess(MIXED_TRACKS, MediaType.APPLICATION_JSON));

        List<AlbumStats> stats = spotifyService.getTopAlbums("token", "long");

        assertThat(stats).hasSize(2);

        assertThat(stats.get(0).albumName()).isEqualTo("Songs for the Deaf");
        assertThat(stats.get(0).trackCount()).isEqualTo(2);

        assertThat(stats.get(1).albumName()).isEqualTo("You Won't Go Before You're Supposed To");
        assertThat(stats.get(1).trackCount()).isEqualTo(1);
    }

    @Test
    void shouldReturnEmptyTracks_WhenApiFails() {
        mockServer.expect(requestTo(containsString("/v1/me/top/tracks")))
                .andRespond(withBadRequest());

        List<Track> tracks = spotifyService.getUserTopTracks("token", "short", 10, 0);

        assertThat(tracks).isEmpty();
    }

    @Test
    void shouldReturnEmptyArtists_WhenApiFails() {
        mockServer.expect(requestTo(containsString("/v1/me/top/artists")))
                .andRespond(withBadRequest());

        List<Artist> artists = spotifyService.getUserTopArtists("token", "short", 10, 0);

        assertThat(artists).isEmpty();
    }

    @Test
    void shouldReturnEmptyAlbums_WhenApiFails() {
        mockServer.expect(requestTo(containsString("/v1/artists/id/albums")))
                .andRespond(withBadRequest());

        List<Album> albums = spotifyService.getAlbumsFromArtist("token", "id");

        assertThat(albums).isEmpty();
    }

    @Test
    void shouldHandleMissingImagesInTracks() {
        String jsonMissingImage = """
            {
              "items": [
                {
                  "name": "Suffocating Hallucination",
                  "artists": [{"name": "Knocked Loose"}],
                  "album": { "name": "Album", "images": [] },
                  "external_urls": {}
                }
              ]
            }
        """;
        mockServer.expect(requestTo(containsString("/v1/me/top/tracks")))
                .andRespond(withSuccess(jsonMissingImage, MediaType.APPLICATION_JSON));

        List<Track> tracks = spotifyService.getUserTopTracks("token", "long", 10, 0);

        assertThat(tracks).hasSize(1);
        assertThat(tracks.get(0).imageUrl()).isEmpty();
    }

    @Test
    void shouldHandleMissingGenresInArtists() {
        String jsonMissingGenres = """
            {
              "items": [
                {
                  "id": "1",
                  "name": "Unknown Band",
                  "genres": [],
                  "images": [],
                  "external_urls": {}
                }
              ]
            }
        """;
        mockServer.expect(requestTo(containsString("/v1/me/top/artists")))
                .andRespond(withSuccess(jsonMissingGenres, MediaType.APPLICATION_JSON));

        List<Artist> artists = spotifyService.getUserTopArtists("token", "long", 10, 0);

        assertThat(artists).hasSize(1);
        assertThat(artists.get(0).genres()).isEmpty();
    }

    @Test
    void shouldParseTracksFromJson_WithEmptyList() throws Exception {
        List<Track> tracks = spotifyService.parseTracksFromJson(EMPTY_ITEMS);
        assertThat(tracks).isEmpty();
    }

    @Test
    void shouldParseArtistsFromJson_WithEmptyList() throws Exception {
        List<Artist> artists = spotifyService.parseArtistsFromJson(EMPTY_ITEMS);
        assertThat(artists).isEmpty();
    }

    @Test
    void shouldParseAlbumsFromJson_WithEmptyList() throws Exception {
        List<Album> albums = spotifyService.parseAlbumsFromJson(EMPTY_ITEMS);
        assertThat(albums).isEmpty();
    }
}