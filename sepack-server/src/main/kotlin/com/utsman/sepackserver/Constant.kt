package com.utsman.sepackserver

import com.utsman.sepackserver.data.Dependency
import com.utsman.sepackserver.data.Template

object Constant {

    fun getTemplates(): List<Template> {
        return listOf(
            Template(
                name = "Basic",
                url = "https://github.com/utsmannn/sepack-basic"
            ),
            Template(
                name = "Basic with Glide",
                url = "https://github.com/utsmannn/sepack-basic-glide"
            ),
            Template(
                name = "Basic with Recyclerview",
                url = "https://github.com/utsmannn/sepack-basic-recyclerview/"
            )
        )
    }

    fun getDeps(): List<Dependency> {
        return listOf(
            Dependency(
                name = "Retrofit",
                version = "2.9.0",
                file = "build.gradle",
                deps = "com.squareup.retrofit2:retrofit"
            ),
            Dependency(
                name = "Glide",
                version = "4.11.0",
                file = "build.gradle",
                deps = "com.github.bumptech.glide:glide"
            ),
        )
    }
}