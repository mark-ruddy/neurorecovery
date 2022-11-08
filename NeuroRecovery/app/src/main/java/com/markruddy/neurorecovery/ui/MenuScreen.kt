package com.markruddy.neurorecovery

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.markruddy.neurorecovery.model.MenuItemModel

@Composable
fun MenuScreen(modifier: Modifier = Modifier, menuItemList: List<MenuItemModel>) {
    LazyColumn {
        items(menuItemList) { menuItem ->
            MenuItem(menuItem = menuItem)
        }
    }
}


@Composable
fun MenuItem(modifier: Modifier = Modifier, menuItem: MenuItemModel) {
    Button(
        modifier = Modifier.padding(8.dp).height(50.dp).fillMaxWidth(),
        onClick = { /*showToast(context, "Button clicked")*/ },
    ) {
        Icon(
            modifier = Modifier.size(ButtonDefaults.IconSize),
            imageVector = menuItem.icon,
            contentDescription = stringResource(menuItem.stringResourceId),
        )
        Spacer(modifier = Modifier.size(ButtonDefaults.IconSpacing))
        Text(stringResource(menuItem.stringResourceId))
    }
}