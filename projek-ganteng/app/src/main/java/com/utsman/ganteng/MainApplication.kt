package com.utsman.ganteng

import android.app.Application
import org.koin.core.context.startKoin

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // start Koin for dependencies injection
        startKoin {
            modules(
                repository,
                viewModel
            )
        }
    }
}