package com.utsman.ganteng

import com.utsman.ganteng.data.network.Service
import com.utsman.ganteng.repository.MainRepository
import com.utsman.ganteng.viewmodel.MainViewModel
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module

/**
 * Koin module instance
 * doc: {@link 'https://medium.com/koin-developers/unboxing-koin-2-1-7f1133ebb790' }
 */

val repository = module {
    single { Service.create() }
    single { MainRepository(get()) }
}

val viewModel = module {
    viewModel { MainViewModel(get()) }
}