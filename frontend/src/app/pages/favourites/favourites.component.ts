import { Component, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../../servicios/category.service';
import { NavBarComponent } from '../../componentes/nav-bar/nav-bar.component';
import { UrlCardComponent } from '../../componentes/url-card/url-card.component';
import { HeaderFSComponent } from "../../componentes/header-fs/header-fs.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UrlDataService } from '../../servicios/url-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-favourites',
  imports: [NavBarComponent, UrlCardComponent, HeaderFSComponent, CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent {
  private destroy$ = new Subject<void>();
  favoriteItems: any[] = [];

  constructor(
    private categoryService: CategoryService, 
    private urlDataService: UrlDataService, 
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.categoryService.reloadCategories();
  
    this.categoryService.favoriteItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites: any[]) => {
        this.favoriteItems = favorites.map(item => ({
          ...item,
          categoryId: this.categoryService.getCategoryIdByUrl(item.url),
          categoryName: this.categoryService.getCategoryNameByUrl(item.url)
        }));
        this.cdRef.detectChanges();
      });      
  
    this.categoryService.updateFavoriteItems();
  }       

  openDetails(item: any) {
    const allItems = this.categoryService.getAllItems();
    const fullItem = allItems.find(i => i.url === item.url && i.name === item.name);
  
    if (!fullItem) {
      console.error("No se encontró el item completo para:", item);
      return;
    }
  
    const enrichedItem = {
      ...fullItem,
      categoryId: this.categoryService.getCategoryIdByUrl(fullItem.url),
      categoryName: this.categoryService.getCategoryNameByUrl(fullItem.url)
    };
  
    this.urlDataService.setUrlData(enrichedItem);
    this.router.navigate(['/url-detail']);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async removeFromFavorites(item: any) {
    if (!item.categoryId) {
      console.error("Falta categoryId en el item:", item);
      return;
    }
  
    await this.categoryService.toggleFavorite(item.categoryId, item.name);
    await this.categoryService.reloadCategories();
    await this.categoryService.updateFavoriteItems();
  }     

  async toggleFavorite(item: any) {
    if (!item.categoryId) {
      console.error("Falta categoryId en el item:", item);
      return;
    }
  
    await this.categoryService.toggleFavorite(item.categoryId, item.name);
    await this.categoryService.reloadCategories();
    await this.categoryService.updateFavoriteItems();
  }   
}