package com.utsman.ganteng.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.utsman.ganteng.repository.MainRepository
import kotlinx.coroutines.launch
import kotlinx.coroutines.plus

// provide repository in constructor
// inject by Koin
class MainViewModel(private val mainRepository: MainRepository) : ViewModel() {

    // merge scope from viewmodel and repository
    private val scope = viewModelScope.plus(mainRepository.scope.coroutineContext)

    // provide value as livedata for bind able to lifecycle activity/fragment
    val users = mainRepository.user
        .asLiveData(viewModelScope.coroutineContext)

    // triggered fetch user in repository
    fun users() = scope.launch {
        mainRepository.users()
    }
}