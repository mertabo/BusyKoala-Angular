import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';
import { HomeComponent } from './home/home.component';
import { MonthsModule } from './months/months.module';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CreateEventFormComponent,
    HomeComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    WorkspacesModule,
    MonthsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
