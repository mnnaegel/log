package com.example.speedrunserver.controller

import com.example.speedrunserver.model.CreateSplitRequest
import com.example.speedrunserver.model.Split
import com.example.speedrunserver.service.SplitService
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/api/splits")
class SplitController(private val splitService: SplitService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createSplit(
        @RequestBody request: CreateSplitRequest,
        @AuthenticationPrincipal userId: String
    ): Split {
        val split = Split(
            name = request.name,
            startTime = request.startTime,
            pessimisticEstimate = request.pessimisticEstimate,
            state = request.state,
            userId = UUID.fromString(userId)
        )
        return splitService.createSplit(split)
    }

    @GetMapping
    fun getSplits(
        @AuthenticationPrincipal userId: String,
        @RequestParam startTime: Long?,
        @RequestParam endTime: Long?
    ): List<Split> {
        return if (startTime != null && endTime != null) {
            splitService.getSplitsByUserAndTimeRange(
                UUID.fromString(userId),
                startTime,
                endTime
            )
        } else {
            splitService.getSplitsByUserAndTimeRange(
                UUID.fromString(userId),
                Long.MIN_VALUE,
                Long.MAX_VALUE)
        }
    }

    @PutMapping("/{id}")
    fun updateSplit(
        @PathVariable id: UUID,
        @RequestBody split: Split,
        @AuthenticationPrincipal userId: String
    ): Split {
        // Ensure the split belongs to the authenticated user
        val existingSplit = splitService.getSplitById(id)
        if (existingSplit.userId != UUID.fromString(userId)) {
            throw UnauthorizedException("You don't have permission to update this split")
        }
        return splitService.updateSplit(id, split)
    }

    @DeleteMapping("/{id}")
    fun deleteSplit(
        @PathVariable id: UUID,
        @AuthenticationPrincipal userId: String
    ) {
        // Ensure the split belongs to the authenticated user
        val existingSplit = splitService.getSplitById(id)
        if (existingSplit.userId != UUID.fromString(userId)) {
            throw UnauthorizedException("You don't have permission to delete this split")
        }
        splitService.deleteSplit(id)
    }

    @ExceptionHandler(NoSuchElementException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(e: NoSuchElementException) = e.message

    @ExceptionHandler(UnauthorizedException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun handleUnauthorized(e: UnauthorizedException) = e.message
}

class UnauthorizedException(message: String) : RuntimeException(message)