package com.utsman.ganteng.ext

import com.utsman.ganteng.domain.Result
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow


// use case function for any call route
suspend fun <T: Any> api(call: suspend () -> T): Flow<Result<T>> = flow {
    emit(Result.Loading())
    try {
        val data = call.invoke()
        emit(Result.Success(data))
    } catch (e: Throwable) {
        emit(Result.Error(th = e))
    }
}