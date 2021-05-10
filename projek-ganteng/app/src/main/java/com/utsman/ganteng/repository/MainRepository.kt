package com.utsman.ganteng.repository

import com.utsman.ganteng.data.model.Reqres
import com.utsman.ganteng.data.network.Routes
import com.utsman.ganteng.ext.api
import com.utsman.ganteng.ext.stateOf
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

// The main repository
// stream data start here
class MainRepository(private val routes: Routes) {

    val scope = CoroutineScope(Dispatchers.Default)
    val user = stateOf<List<Reqres.User>>()

    suspend fun users(): Job = scope.launch {

        // call api using `api { }`
        // function as flow
        api {
            routes.user().data
        }.collect {
            user.value = it
        }
    }
}