package com.example.speedrunserver.repository

import com.example.speedrunserver.model.Split
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SplitRepository : JpaRepository<Split, UUID> {
    fun findByUserIdOrderByStartTimeDesc(userId: UUID): List<Split>

    fun findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(
        userId: UUID,
        startTime: Long,
        endTime: Long
    ): List<Split>
}