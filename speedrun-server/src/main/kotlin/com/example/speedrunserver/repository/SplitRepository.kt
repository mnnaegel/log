package com.example.speedrunserver.repository

import com.example.speedrunserver.model.Split
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SplitRepository : JpaRepository<Split, UUID> {
    @Query("SELECT s FROM Split s WHERE s.userId = :userId ORDER BY s.startTime DESC")
    fun findByUserIdOrderByStartTimeDesc(userId: UUID): List<Split>
}