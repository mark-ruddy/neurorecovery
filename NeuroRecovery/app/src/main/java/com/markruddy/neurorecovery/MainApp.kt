@file:OptIn(ExperimentalMaterial3Api::class)

package com.markruddy.neurorecovery

import androidx.annotation.StringRes
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.markruddy.neurorecovery.data.MenuItemsSource
import com.markruddy.neurorecovery.ui.StartScreen

enum class MainScreen(@StringRes val title: Int) {
    Start(title = R.string.app_name),
    Menu(title = R.string.menu_name),
}

@Composable
fun MainAppBar(
        modifier: Modifier = Modifier,
        currentScreen: MainScreen,
        canNavigateBack: Boolean,
        navigateUp: () -> Unit,
) {
    TopAppBar(
            title = { Text(stringResource(currentScreen.title)) },
            modifier = modifier,
            navigationIcon = {
                if (canNavigateBack) {
                    IconButton(onClick = navigateUp) {
                        Icon(
                                imageVector = Icons.Filled.ArrowBack,
                                contentDescription = stringResource(R.string.back_button),
                        )
                    }
                }
            }
    )
}

@Preview(showBackground = true)
@Composable
fun MainApp(
        modifier: Modifier = Modifier,
        navController: NavHostController = rememberNavController(),
) {
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentScreen =
            MainScreen.valueOf(backStackEntry?.destination?.route ?: MainScreen.Start.name)
    Scaffold(
            topBar = {
                MainAppBar(
                        currentScreen = currentScreen,
                        canNavigateBack = navController.previousBackStackEntry != null,
                        navigateUp = { navController.navigateUp() },
                )
            }
    ) { innerPadding ->
        NavHost(
                navController = navController,
                startDestination = MainScreen.Start.name,
                modifier = modifier.padding(innerPadding)
        ) {
            composable(route = MainScreen.Start.name) {
                StartScreen(onMenuButtonClicked = { navController.navigate(MainScreen.Menu.name) })
            }
            composable(route = MainScreen.Menu.name) {
                MenuScreen(
                        menuItemList = MenuItemsSource().loadMenuItems(),
                )
            }
        }
    }
}

