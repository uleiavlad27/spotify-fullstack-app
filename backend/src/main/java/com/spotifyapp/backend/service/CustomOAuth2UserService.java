package com.spotifyapp.backend.service;

import com.spotifyapp.backend.entity.User;
import com.spotifyapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String spotifyId = (String) attributes.get("id");
        String displayName = (String) attributes.get("display_name");
        String email = (String) attributes.get("email");

        String profileImageUrl = null;
        if(attributes.get("images") instanceof List) {
            List<?> images = (List<?>) attributes.get("images");
            if(!images.isEmpty()){
                Object firstImageObj = images.get(0);
                if(firstImageObj instanceof Map){
                    Map<?,?> firstImage = (Map<?,?>) firstImageObj;
                    profileImageUrl = (String) firstImage.get("url");
                }
            }
        }
        saveOrUpdateUser(spotifyId, displayName, email, profileImageUrl);

        return oAuth2User;
    }

    private void saveOrUpdateUser(String spotifyId, String displayName, String email, String profileImageUrl) {
        Optional<User> existingUser = userRepository.findBySpotifyId(spotifyId);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setDisplayName(displayName);
            user.setEmail(email);
            user.setProfileImageUrl(profileImageUrl);
            userRepository.save(user);
        } else {
            User newUser = new User();
            newUser.setSpotifyId(spotifyId);
            newUser.setDisplayName(displayName);
            newUser.setEmail(email);
            newUser.setProfileImageUrl(profileImageUrl);
            userRepository.save(newUser);
        }
    }
}
