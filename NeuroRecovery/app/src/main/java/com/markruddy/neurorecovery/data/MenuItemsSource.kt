package com.markruddy.neurorecovery.data

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material.icons.rounded.Edit
import androidx.compose.material.icons.rounded.Person
import com.markruddy.neurorecovery.R
import com.markruddy.neurorecovery.model.MenuItemModel

class MenuItemsSource {
    fun loadMenuItems(): List<MenuItemModel> {
        val matIcons = Icons.Rounded
        return listOf<MenuItemModel>(
            MenuItemModel(R.string.menu_title_non_scheduled_session, matIcons.Person),
            MenuItemModel(R.string.menu_title_scheduled_session, matIcons.Call),
            MenuItemModel(R.string.menu_title_update_info, matIcons.Edit),
        )
    }
}