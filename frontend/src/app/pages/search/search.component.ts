import { Component } from '@angular/core';
import { CategoryService } from '../../servicios/category.service';
import { FormsModule } from '@angular/forms';
import { HeaderFSComponent } from '../../componentes/header-fs/header-fs.component';
import { NavBarComponent } from '../../componentes/nav-bar/nav-bar.component';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UrlDataService } from '../../servicios/url-data.service';
import { UrlCardComponent } from '../../componentes/url-card/url-card.component';

@Component({
  selector: 'app-search',
  imports: [FormsModule, HeaderFSComponent, NavBarComponent, CommonModule, UrlCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private urlDataService: UrlDataService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  search() {
    const allItems = this.categoryService.getAllItems();
  
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      this.cdr.detectChanges();
      return;
    }
  
    this.searchResults = allItems
      .filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .map(item => ({
        ...item,
        categoryId: this.categoryService.getCategoryIdByUrl(item.url),
        categoryName: this.categoryService.getCategoryNameByUrl(item.url)
      }));
  
    this.cdr.detectChanges();
  }  

  openDetails(item: any) {
    if (!item.categoryId || !item.categoryName) {
      console.error("Faltan datos de categoría en el item:", item);
      return;
    }
  
    this.urlDataService.setUrlData(item);
    this.router.navigate(['/url-detail']);
  }
  
  getFullItemData(item: any) {
    const allItems = this.categoryService.getAllItems();
    return allItems.find(i => i.url === item.url) || item;
  }

  ngOnInit() {
    this.categoryService.favoriteItems$.subscribe(() => {
      this.search();
    });
  }

  async toggleFavorite(item: any) {
    const categoryId = this.categoryService.getCategoryIdByUrl(item.url);
    if (!categoryId) {
      console.error("No se encontró categoryId para la URL:", item.url);
      return;
    }
  
    await this.categoryService.toggleFavorite(categoryId, item.name);
    await this.categoryService.reloadCategories();
  
    this.search();

    this.cdr.detectChanges();
  }  
}