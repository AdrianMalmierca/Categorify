import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateCategoryComponent } from './componentes/create-category/create-category.component';
import { NgModule } from '@angular/core';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { SearchComponent } from './pages/search/search.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';
import { AddUrlComponent } from './pages/add-url/add-url.component';
import { UrlDetailComponent } from './pages/url-detail/url-detail.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'favorites', component: FavouritesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'category/:categoryId', component: CategoryDetailComponent },
  { path: 'create-category', component: CreateCategoryComponent },
  { path: 'url-detail', component: UrlDetailComponent },
  { path: 'category/:categoryId/add-url', component: AddUrlComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}