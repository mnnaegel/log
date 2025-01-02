package com.example.speedrunserver.service

import com.example.speedrunserver.model.Split
import com.example.speedrunserver.repository.SplitRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*
import kotlin.NoSuchElementException

@Service
class SplitService(private val splitRepository: SplitRepository) {
    fun deleteSplit(id: UUID) {
        splitRepository.deleteById(id)
    }

    fun getSplitsByUserAndTimeRange(userId: UUID, startTime: Long, endTime: Long): List<Split> {
        return splitRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(userId, startTime, endTime)
    }

    fun createSplit(split: Split): Split {
        return splitRepository.save(split)
    }

    fun getSplitById(id: UUID): Split {
        return splitRepository.findByIdOrNull(id)
            ?: throw NoSuchElementException("Split not found with id: $id")
    }

    fun updateSplit(id: UUID, updatedSplit: Split): Split {
        val existingSplit = getSplitById(id)

        existingSplit.apply {
            name = updatedSplit.name
            endTime = updatedSplit.endTime
            state = updatedSplit.state
        }

        return splitRepository.save(existingSplit)
    }
}