package com.utsman.ganteng.data.network

import com.utsman.ganteng.data.model.Reqres
import retrofit2.http.GET

interface Routes {

    @GET("/api/users")
    suspend fun user(): Reqres

}