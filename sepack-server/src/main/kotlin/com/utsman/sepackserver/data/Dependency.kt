package com.utsman.sepackserver.data

data class Dependency(
    val name: String,
    val file: String,
    val deps: String,
    val version: String
)