package com.example.speedrunserver.model

import java.util.*

data class CreateSplitRequest(
    val name: String,
    val startTime: Long,
    val pessimisticEstimate: Int,
    val state: SplitState,
    val userId: UUID
)