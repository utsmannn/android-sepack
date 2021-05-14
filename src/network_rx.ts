import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise } from "axios"
import { base_url } from "./constant"
import { defer, Observable } from "rxjs"
import { map } from "rxjs/operators"

export class Network {
    public instance: AxiosInstance
    constructor() {
        var config: AxiosRequestConfig = {
            baseURL: base_url
        }

        this.instance = axios.create(config)
    }

    get<T>(endpoint: string) : Observable<T> {
        var request = this.instance.get<T>(endpoint)
        var getDefer = defer(() => request).pipe(map(result => result.data))
        return getDefer
    }

}