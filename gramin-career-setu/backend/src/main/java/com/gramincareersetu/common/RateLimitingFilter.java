package com.gramincareersetu.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * In-memory rate limiting and abuse mitigation filter for public submission endpoints.
 * Throttles excessive requests per client IP to protect against automated spam and denial-of-service.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    @Value("${app.rate-limiting.enabled:true}")
    private boolean enabled;

    @Value("${app.rate-limiting.max-requests-per-minute:25}")
    private int maxRequestsPerMinute;

    private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!enabled || !isProtectedEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        String endpoint = request.getRequestURI();
        String key = clientIp + ":" + endpoint;

        long currentMinute = System.currentTimeMillis() / 60000;
        RequestCounter counter = requestCounts.compute(key, (k, existing) -> {
            if (existing == null || existing.minute != currentMinute) {
                return new RequestCounter(currentMinute, 1);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        // Periodic cleanup of stale entries when map grows
        if (requestCounts.size() > 2000) {
            requestCounts.entrySet().removeIf(entry -> entry.getValue().minute < currentMinute);
        }

        if (counter.count.get() > maxRequestsPerMinute) {
            log.warn("Rate limit exceeded for IP {} on endpoint {}", clientIp, endpoint);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");

            ApiResponse<Void> apiResponse = ApiResponse.error("Too many requests from this address. Please wait a minute before submitting again.");
            response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isProtectedEndpoint(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return false;
        }
        String uri = request.getRequestURI();
        return (uri.startsWith("/api/v1/jobs/") && uri.endsWith("/apply"))
                || (uri.startsWith("/api/v1/workshops/") && (uri.endsWith("/register") || uri.endsWith("/cancel")))
                || uri.equals("/api/v1/resumes/calculate-ats")
                || uri.equals("/api/v1/quiz/submit");
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    private static class RequestCounter {
        final long minute;
        final AtomicInteger count;

        RequestCounter(long minute, int initialCount) {
            this.minute = minute;
            this.count = new AtomicInteger(initialCount);
        }
    }
}
