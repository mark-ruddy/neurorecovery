package com.markruddy.neurorecovery.model

import androidx.annotation.StringRes
import androidx.compose.ui.graphics.vector.ImageVector

data class MenuItemModel(
        @StringRes val stringResourceId: Int,
        val icon: ImageVector,
)
