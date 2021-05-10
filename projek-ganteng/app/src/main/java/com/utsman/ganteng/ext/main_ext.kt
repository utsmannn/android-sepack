@file:Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")

package com.utsman.ganteng.ext

import android.content.Context
import android.util.Log
import android.widget.Toast

const val TAG = "---- YOUR TAG ----"

fun logi(msg: String?) = Log.i(TAG, msg)
fun loge(msg: String?) = Log.e(TAG, msg)

fun Context.toast(msg: String?) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
fun Context.longToast(msg: String?) = Toast.makeText(this, msg, Toast.LENGTH_LONG).show()