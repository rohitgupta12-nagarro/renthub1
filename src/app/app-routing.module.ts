import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'RentHub - Apartment Rentals' },
  { path: 'listings/:id', component: ListingDetailComponent, title: 'Apartment Details - RentHub' },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard], title: 'Create Post - RentHub' },
  { path: 'preview-post', component: PreviewPostComponent, canActivate: [AuthGuard], title: 'Preview & Submit - RentHub' },
  { path: 'login', component: LoginComponent, title: 'Login - RentHub' },
  { path: 'register', component: RegisterComponent, title: 'Register - RentHub' },
  { path: 'favorites', component: FavoritesComponent, title: 'My Favorites - RentHub' },
  { path: 'inquiries', component: InquiriesComponent, canActivate: [AuthGuard], title: 'My Inquiries - RentHub' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], title: 'User Profile - RentHub' },
  { path: '**', component: NotFoundComponent, title: '404 Not Found - RentHub' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
