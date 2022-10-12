import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ApiReviewComponent } from './api-review/api-review.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ApiReviewComponent,
    // AddEditConnectionComponent
    // ConnectionHandelingComponent
    // InputHandelingComponent
    // ProjectHandelingComponent,
    // DashboardtilesComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    // DragDropModule
  ],
  // entryComponents: [ListitemComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
