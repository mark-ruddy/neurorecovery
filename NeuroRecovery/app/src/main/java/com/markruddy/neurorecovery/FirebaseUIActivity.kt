package com.markruddy.neurorecovery

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.firebase.ui.auth.AuthUI
import com.firebase.ui.auth.FirebaseAuthUIActivityResultContract
import com.firebase.ui.auth.data.model.FirebaseAuthUIAuthenticationResult
import com.google.firebase.auth.FirebaseAuth

class FirebaseUIActivity : AppCompatActivity() {
    private val signInLauncher =
            registerForActivityResult(FirebaseAuthUIActivityResultContract()) { res ->
                this.onSignInResult(res)
            }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_firebase_ui)
    }

    private fun createSignInIntent() {
        val providers =
                arrayListOf(
                        AuthUI.IdpConfig.EmailBuilder().build(),
                        AuthUI.IdpConfig.GoogleBuilder().build(),
                )

        val signInIntent =
                AuthUI.getInstance()
                        .createSignInIntentBuilder()
                        .setAvailableProviders(providers)
                        // .setLogo(R.drawable.my_logo).setTheme(R.style.MyTheme)
                        .build()
        signInLauncher.launch(signInIntent)
    }

    private fun onSignInResult(result: FirebaseAuthUIAuthenticationResult) {
        val response = result.idpResponse
        if (result.resultCode == RESULT_OK) {
            val user = FirebaseAuth.getInstance().currentUser
            // go to next activity
        } else {
            // TODO: show toast for sign in failure
        }
    }

    private fun signOut() {
        AuthUI.getInstance().signOut(this)
        // TODO: toast may be required .addOnCompleteListener {}
    }

    private fun delete() {
        AuthUI.getInstance().delete(this)
        // TODO: toast may be required .addOnCompleteListener {}
    }
}

