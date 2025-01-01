package com.example.speedrunserver.controller

import com.example.speedrunserver.model.Split
import com.example.speedrunserver.service.SplitService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.NoSuchElementException

@RestController
@RequestMapping("/api/splits")
class SplitController(private val splitService: SplitService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createSplit(@RequestBody split: Split): Split {
        return splitService.createSplit(split)
    }

    @GetMapping("/user/{userId}")
    fun getSplitsByUser(@PathVariable userId: UUID): List<UUID> {
        return splitService.getSplitsByUser(userId).map { it.id }
    }

    @PutMapping("/{id}")
    fun updateSplit(
        @PathVariable id: UUID,
        @RequestBody split: Split
    ): Split {
        return splitService.updateSplit(id, split)
    }

    @ExceptionHandler(NoSuchElementException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(e: NoSuchElementException) = e.message
}