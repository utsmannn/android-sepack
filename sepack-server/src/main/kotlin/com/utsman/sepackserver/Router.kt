package com.utsman.sepackserver

import com.utsman.sepackserver.data.Template
import com.utsman.sepackserver.data.Version
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class Router {

    @GetMapping("/api/version")
    fun getVersion(): Version {
        return Version(
            name = "Android Sepack",
            version = "1.0.0",
            templates = Constant.getTemplates(),
            dependencies = Constant.getDeps()
        )
    }
}