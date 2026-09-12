package com.gramincareersetu.resumes;

import com.gramincareersetu.common.ApiResponse;
import com.gramincareersetu.users.UserEntity;
import com.gramincareersetu.users.UserService;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;

    @Autowired
    public ResumeController(ResumeService resumeService, UserService userService) {
        this.resumeService = resumeService;
        this.userService = userService;
    }

    @GetMapping("/my-resume")
    public ResponseEntity<ApiResponse<ResumeDto>> getMyResume(Authentication authentication) {
        UserEntity user = resolveUser(authentication);
        ResumeDto resume = resumeService.getResumeByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(resume));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeDto>> saveResume(
            Authentication authentication,
            @Valid @RequestBody SaveResumeRequest request
    ) {
        UserEntity user = resolveUser(authentication);
        ResumeDto saved = resumeService.saveResume(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Resume saved successfully", saved));
    }

    @PostMapping("/calculate-ats")
    public ResponseEntity<ApiResponse<AtsEvaluationDto>> calculateAtsScore(@RequestBody String resumeJson) {
        AtsEvaluationDto evaluation = resumeService.evaluateAts(resumeJson);
        return ResponseEntity.ok(ApiResponse.ok("ATS evaluation completed", evaluation));
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
            keycloakId = "local-dev-user-001";
            email = "dev@gramincareersetu.org";
            fullName = "Development Scholar";
        }

        return userService.getOrCreateUserFromPrincipal(keycloakId, email, fullName, roles);
    }
}
