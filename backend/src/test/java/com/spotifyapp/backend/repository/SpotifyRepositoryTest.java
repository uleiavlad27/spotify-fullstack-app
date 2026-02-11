package com.spotifyapp.backend.repository;

import com.spotifyapp.backend.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;


@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SpotifyRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("save user & find user by id")
    void shouldSaveAndFindUserById() {

        String spotifyId = "test_spotify_id";

        User user = new User();
        user.setDisplayName("testName");
        user.setSpotifyId(spotifyId);
        user.setEmail("test@test.com");
        user.setProfileImageUrl("https://fake.com/fake.jpg");

        userRepository.save(user);

        Optional<User> testFoundUser = userRepository.findBySpotifyId(spotifyId);

        assertThat(testFoundUser).isPresent();
        assertThat(testFoundUser.get().getSpotifyId()).isEqualTo(spotifyId);
        assertThat(testFoundUser.get().getDisplayName()).isEqualTo("testName");
        assertThat(testFoundUser.get().getEmail()).isEqualTo("test@test.com");
        assertThat(testFoundUser.get().getProfileImageUrl()).isEqualTo("https://fake.com/fake.jpg");
        assertThat(testFoundUser.get().getId()).isNotNull();
    }

    @Test
    @DisplayName("Find Non-Existent User --- Should return empty")
    void shouldReturnEmpty_WhenUserDoesNotExist() {
        Optional<User> result = userRepository.findBySpotifyId("ghost_user_id_999");

        assertThat(result).isEmpty();
    }
}
