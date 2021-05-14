import { Dependencies, VersionApi } from './model';
import axios from "axios"
import { base_url } from './constant';

export async function getApiVersion(): Promise<VersionApi> {
    const data = await axios.get<VersionApi>(base_url + "/version")
    return data.data
}

export async function searchDependencies(params:string): Promise<Dependencies[]> {
    const data = await axios.get<Dependencies[]>(base_url + "/dependencies?search=" + params)
    return data.data
}