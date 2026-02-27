import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Item } from '../../servicios/category.service';
import { UrlDataService } from '../../servicios/url-data.service';
import { NgStyle } from '@angular/common';
import { UrlCardComponent } from "../../componentes/url-card/url-card.component";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css',
  standalone: true,
  imports: [UrlCardComponent],
})
export class CategoryDetailComponent {
  categoryId = '';
  categoryName = '';
  urls: Item[] = [];
  showDeletePopup = false;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private urlDataService: UrlDataService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';

    const category = this.categoryService.getCategories().find(cat => cat._id === this.categoryId);

    if (category) {
      this.categoryName = category.name;
      this.urls = this.categoryService.getUrlsByCategory(this.categoryId);
    } else {
      console.error(`Categoría no encontrada para ID: ${this.categoryId}`);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async addUrl() {
    const name = prompt('Nombre de la URL:');
    const url = prompt('Introduce la URL:');

    if (name && url && this.categoryId) {
      await this.categoryService.addUrlToCategory(this.categoryId, { name, url, isFavorite: false });
      this.urls = this.categoryService.getUrlsByCategory(this.categoryId);
    }
  }

  async toggleFavorite(url: Item) {
    if (this.categoryId) {
      await this.categoryService.toggleFavorite(this.categoryId, url.name);
      this.urls = this.categoryService.getUrlsByCategory(this.categoryId);
    }
  }

  goToAddUrl() {
    this.router.navigate([`/category/${this.categoryId}/add-url`]);
  }

  openDetails(item: Item) {
    const enrichedItem = {
      ...item,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    };
  
    this.urlDataService.setUrlData(enrichedItem);
    this.router.navigate(['/url-detail']);
  }   

  openDeletePopup() {
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
  }

  async deleteCategory() {
    if (this.categoryId) {
      await this.categoryService.deleteCategory(this.categoryId);
      this.router.navigate(['/']);
    }
  }
}