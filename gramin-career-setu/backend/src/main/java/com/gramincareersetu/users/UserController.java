package com.gramincareersetu.users;

import com.gramincareersetu.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        UserEntity user = resolveUser(authentication);
        UserDto dto = userService.getUserDtoById(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserEntity user = resolveUser(authentication);
        UserDto updated = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    private UserEntity resolveUser(Authentication authentication) {
        String keycloakId = null;
        String email = null;
        String fullName = null;
        Set<String> roles = Collections.emptySet();

        if (authentication != null) {
            roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            if (authentication.getPrincipal() instanceof Jwt jwt) {
                keycloakId = jwt.getSubject();
                email = jwt.getClaimAsString("email");
                fullName = jwt.getClaimAsString("name");
                if (fullName == null) {
                    fullName = jwt.getClaimAsString("preferred_username");
                }
            } else {
                keycloakId = authentication.getName();
                email = authentication.getName() + "@gramincareersetu.org";
                fullName = authentication.getName();
            }
        }

        if (keycloakId == null) {
            keycloakId = "anonymous-dev-user";
            email = "dev@gramincareersetu.org";
            fullName = "Development Scholar";
        }

        return userService.getOrCreateUserFromPrincipal(keycloakId, email, fullName, roles);
    }
}
