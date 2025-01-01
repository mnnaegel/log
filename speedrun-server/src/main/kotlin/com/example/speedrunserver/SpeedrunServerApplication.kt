package com.example.speedrunserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SpeedrunServerApplication

fun main(args: Array<String>) {
	runApplication<SpeedrunServerApplication>(*args)
}
