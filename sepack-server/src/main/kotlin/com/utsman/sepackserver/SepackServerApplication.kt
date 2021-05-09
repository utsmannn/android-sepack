package com.utsman.sepackserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SepackServerApplication

fun main(args: Array<String>) {
	runApplication<SepackServerApplication>(*args)
}
