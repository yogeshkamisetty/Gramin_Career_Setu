package com.gramincareersetu.auth;

import com.gramincareersetu.users.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final SecretKey key;
    private final long validityInMilliseconds;

    public JwtTokenService(
            @Value("${app.jwt.secret:GraminCareerSetuSecureJwtSecretKeyMustBeAtLeast256BitsLongForHS256Security2026!}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long validityInMilliseconds // 24 hours
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = validityInMilliseconds;
    }

    public String generateToken(UserEntity user, String primaryRole) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("phone", user.getPhone() != null ? user.getPhone() : "")
                .claim("name", user.getFullName())
                .claim("email", user.getEmail() != null ? user.getEmail() : "")
                .claim("role", primaryRole)
                .claim("roles", user.getRoles())
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID getUserId(String token) {
        Claims claims = parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }

    public String getPhone(String token) {
        Claims claims = parseClaims(token);
        return claims.get("phone", String.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Claims claims = parseClaims(token);
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?>) {
            return (List<String>) rolesObj;
        }
        String singleRole = claims.get("role", String.class);
        if (singleRole != null) {
            return List.of(singleRole);
        }
        return List.of("STUDENT");
    }

    public long getExpirationMs() {
        return validityInMilliseconds;
    }
}
