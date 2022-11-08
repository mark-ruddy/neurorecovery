package com.markruddy.neurorecovery.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

@Composable
fun StartScreen(
    modifier: Modifier = Modifier,
    onMenuButtonClicked: () -> Unit,
) {
    Column {
        Button(
            modifier = Modifier.padding(8.dp),
            onClick = onMenuButtonClicked,
        ) {
            Text("Go to menu")
        }
    }
}