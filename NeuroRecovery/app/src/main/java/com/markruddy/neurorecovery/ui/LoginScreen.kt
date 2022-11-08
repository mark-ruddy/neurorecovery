package com.markruddy.neurorecovery.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.markruddy.neurorecovery.ui.viewModel.LoginViewModel

data class LoginUiState(
    val email: String = "",
    val password: String = "",
)

@Composable
fun LoginScreen(popUpScreen: () -> Unit, viewModel: LoginViewModel) {
    val uiState by viewModel.uiState

    Column() {
        EmailField(uiState.email, viewModel::onEmailChange)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmailField(value: String, onNewValue: (String) -> Unit, modifier: Modifier = Modifier) {
    OutlinedTextField(
        modifier = modifier,
        singleLine = true,
        value = value,
        onValueChange = { onNewValue(it) },
        placeholder = { Text(R.string.email_placeholder) },
    )
}