import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { AppRoutingModule } from './app-routing.module';
import { InfoComponent } from './info/info.component';
import { AppComponent } from './app.component';
import { InstantComponent } from './instant/instant.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { InstantUlComponent } from './instant-ul/instant-ul.component';
import { InstantLlComponent } from './instant-ll/instant-ll.component';
import { InstantHandComponent } from './instant-hand/instant-hand.component';

export const modulesImports: any[] = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatDialogModule,
  MatSelectModule,
  MatCardModule,
  VgCoreModule,
  VgControlsModule,
  VgOverlayPlayModule,
  VgBufferingModule,
  BrowserModule,
  BrowserAnimationsModule,
  ReactiveFormsModule,
  AppRoutingModule,
]

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    InstantComponent,
    ScheduledComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    InstantUlComponent,
    InstantLlComponent,
    InstantHandComponent,
  ],
  imports: modulesImports,
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
