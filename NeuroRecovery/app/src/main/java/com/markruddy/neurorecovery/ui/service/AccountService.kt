package com.markruddy.neurorecovery.ui.service

import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

interface AccountService {
    fun createAnonymousAccount(onResult: (Throwable?) -> Unit)
    fun authenticate(email: String, password: String, onResult: (Throwable?) -> Unit)
    fun linkAccount(email: String, password: String, onResult: (Throwable?) -> Unit)
}

class AccountServiceImpl {
    override fun createAnonymousAccount(onResult: (Throwable?) -> Unit) {
        Firebase.auth.signInAnonymously().addOnCompleteListener()
    }
}