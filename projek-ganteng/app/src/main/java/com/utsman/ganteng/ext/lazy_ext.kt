@file:Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")

package com.utsman.ganteng.ext

import android.app.Activity
import android.os.Parcelable
import android.view.View
import androidx.annotation.IdRes
import androidx.fragment.app.Fragment

/**
 * Lazy extensions for simplify lazy call
 *
 * @Example
 *
 * `private val userId by stringExtras("user_id")`
 *
 * same with
 *
 * `private val userId by Lazy {
 *    intent.getStringExtra("user_id")
 * }`
 * */

// ===== INTENT EXTRAS ===== //

fun <T: View>Activity.findLazy(@IdRes id: Int): Lazy<T> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        findViewById(id)
    }
}

fun Activity.stringExtras(key: String): Lazy<String> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        try {
            intent.getStringExtra(key)
        } catch (e: NullPointerException) {
            throw java.lang.NullPointerException("String extras not found")
        }
    }
}

fun Activity.intExtras(key: String): Lazy<Int> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        intent.getIntExtra(key, 0)
    }
}

fun Activity.longExtras(key: String): Lazy<Long> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        intent.getLongExtra(key, 0L)
    }
}

fun Activity.booleanExtras(key: String): Lazy<Boolean> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        intent.getBooleanExtra(key, false)
    }
}

fun Activity.parcelExtras(key: String): Lazy<Parcelable?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        try {
            intent.getParcelableExtra(key)
        } catch (e: NullPointerException) {
            throw java.lang.NullPointerException("Parcel extras not found")
        }
    }
}

fun Activity.doubleExtras(key: String): Lazy<Double> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        intent.getDoubleExtra(key, 0.0)
    }
}

// ===== END OF INTENT EXTRAS ===== //


// ===== ARGUMENT EXTRAS ===== //

fun Fragment.stringExtras(key: String): Lazy<String?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        try {
            arguments?.getString(key)
        } catch (e: NullPointerException) {
            throw java.lang.NullPointerException("String extras not found")
        }
    }
}

fun Fragment.intExtras(key: String): Lazy<Int?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        arguments?.getInt(key, 0)
    }
}

fun Fragment.longExtras(key: String): Lazy<Long?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        arguments?.getLong(key, 0L)
    }
}

fun Fragment.booleanExtras(key: String): Lazy<Boolean?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        arguments?.getBoolean(key, false)
    }
}

fun <T>Fragment.parcelExtras(key: String): Lazy<T?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        try {
            arguments?.getParcelable(key) as T?
        } catch (e: NullPointerException) {
            throw java.lang.NullPointerException("Parcel extras not found")
        }
    }
}

fun Fragment.doubleExtras(key: String): Lazy<Double?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        arguments?.getDouble(key, 0.0)
    }
}

fun <T: Parcelable>Fragment.parcelArrayListExtras(key: String): Lazy<ArrayList<T>?> {
    return lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
        try {
            arguments?.getParcelableArrayList(key)
        } catch (e: NullPointerException) {
            throw java.lang.NullPointerException("Parcel extras not found")
        }
    }
}

// ===== END OF ARGUMENT EXTRAS ===== //