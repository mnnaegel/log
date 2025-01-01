package com.example.speedrunserver.service

import com.example.speedrunserver.model.Split
import com.example.speedrunserver.repository.SplitRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import kotlin.NoSuchElementException

@Service
@Transactional
class SplitService(private val splitRepository: SplitRepository) {

    fun createSplit(split: Split): Split {
        return splitRepository.save(split)
    }

    fun getSplitsByUser(userId: UUID): List<Split> {
        return splitRepository.findByUserIdOrderByStartTimeDesc(userId)
    }

    fun updateSplit(id: UUID, updatedSplit: Split): Split {
        val existingSplit = splitRepository.findByIdOrNull(id)
            ?: throw NoSuchElementException("Split not found with id: $id")

        existingSplit.apply {
            name = updatedSplit.name
            endTime = updatedSplit.endTime
            state = updatedSplit.state
        }

        return splitRepository.save(existingSplit)
    }
}
