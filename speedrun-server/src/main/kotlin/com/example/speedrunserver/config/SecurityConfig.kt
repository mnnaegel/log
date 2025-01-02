package com.example.speedrunserver.config

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.DecodedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.security.core.AuthenticationException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.security.interfaces.RSAPublicKey
import java.security.KeyFactory
import java.security.spec.X509EncodedKeySpec
import java.util.Base64

@Configuration
@EnableWebSecurity
class SecurityConfig(
    @Value("\${supabase.jwt.secret}")
    private val jwtSecret: String
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers("/api/splits/**").authenticated()
                   .anyRequest().permitAll()
            }
            .addFilterBefore(JwtAuthenticationFilter(jwtSecret), UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}

class JwtAuthenticationFilter(
    private val jwtSecret: String
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val token = extractToken(request)
            if (token != null) {
                val jwt = verifyToken(token)
                val userId = jwt.subject

                val auth = UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    listOf(SimpleGrantedAuthority("ROLE_USER"))
                )
                SecurityContextHolder.getContext().authentication = auth
            }
        } catch (e: JWTVerificationException) {
            // Invalid token - clear security context
            SecurityContextHolder.clearContext()
        }

        filterChain.doFilter(request, response)
    }

    private fun extractToken(request: HttpServletRequest): String? {
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header?.startsWith("Bearer ") == true) {
            return header.substring(7)
        }
        return null
    }

    private fun verifyToken(token: String): DecodedJWT {
        return JWT.require(Algorithm.HMAC256(jwtSecret))
            .withIssuer("https://xepcdzrorjhxetyurzen.supabase.co/auth/v1")
            .build()
            .verify(token)
    }
}