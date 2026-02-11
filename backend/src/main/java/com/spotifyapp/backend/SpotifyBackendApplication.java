package com.spotifyapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class SpotifyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpotifyBackendApplication.class, args);
	}

}
