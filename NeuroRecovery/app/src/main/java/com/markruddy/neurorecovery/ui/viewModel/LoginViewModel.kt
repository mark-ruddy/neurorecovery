package com.markruddy.neurorecovery.ui.viewModel

import androidx.compose.runtime.mutableStateOf
import com.markruddy.neurorecovery.ui.LoginUiState

class LoginViewModel {
    var uiState = mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(newValue: String) {
        uiState.value = uiState.value.copy(email = newValue)
    }
}