import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailComponent } from './components/listing-detail/listing-detail.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PreviewPostComponent } from './components/preview-post/preview-post.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { InquiriesComponent } from './components/inquiries/inquiries.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    HomeComponent,
    ListingDetailComponent,
    CreatePostComponent,
    PreviewPostComponent,
    LoginComponent,
    RegisterComponent,
    FavoritesComponent,
    InquiriesComponent,
    ProfileComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
