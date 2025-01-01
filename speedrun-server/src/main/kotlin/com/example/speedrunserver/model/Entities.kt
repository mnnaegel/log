package com.example.speedrunserver.model

import jakarta.persistence.*
import java.time.Instant
import java.util.*

@Entity
@Table(name = "splits")
data class Split(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(name = "start_time", nullable = false)
    val startTime: Long,

    @Column(name = "end_time")
    var endTime: Long? = null,

    @Column(name = "pessimistic_estimate", nullable = false)
    val pessimisticEstimate: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var state: SplitState,

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
)

enum class SplitState {
    IN_PROGRESS, COMPLETED, ABANDONED
}