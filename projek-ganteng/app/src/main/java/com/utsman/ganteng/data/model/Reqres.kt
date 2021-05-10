package com.utsman.ganteng.data.model


import com.google.gson.annotations.SerializedName

data class Reqres(
    @SerializedName("ad")
    val ad: Ad = Ad(),
    @SerializedName("data")
    val `data`: List<User> = listOf(),
    @SerializedName("page")
    val page: Int = 0,
    @SerializedName("per_page")
    val perPage: Int = 0,
    @SerializedName("total")
    val total: Int = 0,
    @SerializedName("total_pages")
    val totalPages: Int = 0
) {
    data class Ad(
        @SerializedName("company")
        val company: String = "",
        @SerializedName("text")
        val text: String = "",
        @SerializedName("url")
        val url: String = ""
    )

    data class User(
        @SerializedName("avatar")
        val avatar: String = "",
        @SerializedName("email")
        val email: String = "",
        @SerializedName("first_name")
        val firstName: String = "",
        @SerializedName("id")
        val id: Int = 0,
        @SerializedName("last_name")
        val lastName: String = ""
    )
}