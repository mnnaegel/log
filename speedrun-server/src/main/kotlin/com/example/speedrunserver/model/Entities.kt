package com.example.speedrunserver.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "splits")
class Split(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(nullable = false)
    var name: String,

    @Column(name = "start_time", nullable = false)
    var startTime: Long,

    @Column(name = "end_time")
    var endTime: Long? = null,

    @Column(name = "pessimistic_estimate", nullable = false)
    var pessimisticEstimate: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var state: SplitState,

    @Column(name = "user_id", nullable = false)
    var userId: UUID,
) {
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
}

enum class SplitState {
    IN_PROGRESS,
    COMPLETED,
    ABANDONED
}