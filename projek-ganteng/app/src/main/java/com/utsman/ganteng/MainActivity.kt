package com.utsman.ganteng

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.utsman.ganteng.domain.Result
import com.utsman.ganteng.ext.logi
import com.utsman.ganteng.viewmodel.MainViewModel
import kotlinx.android.synthetic.main.activity_main.*
import org.koin.androidx.viewmodel.ext.android.viewModel

class MainActivity : AppCompatActivity() {

    // call viewmodel instance by Koin
    private val viewModel: MainViewModel by viewModel()

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // fetch users
        viewModel.users()

        // observing user as result case
        viewModel.users.observe(this) {
            when (it) {
                is Result.Idle -> {
                    // idle
                    logi("idle..")
                }
                is Result.Loading -> {
                    // loading
                    logi("loading..")
                    txt_log.text = "loading..."
                }
                is Result.Error -> {
                    // error
                    logi("error..")
                    val throwable = it.th
                    txt_log.text = "error, ${throwable.message}"
                    throwable.printStackTrace()
                }
                is Result.Success -> {
                    // success
                    logi("success..")
                    val data = it.data
                    txt_log.text = "success, count user -> ${data.count()}"
                }
            }
        }
    }
}