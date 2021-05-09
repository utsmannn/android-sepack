package com.utsman.sepackserver.data

data class Version(
    val name: String,
    val version: String,
    val templates: List<Template>,
    val dependencies: List<Dependency>
)