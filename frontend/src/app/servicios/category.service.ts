import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelos
export interface Item {
  _id: string;
  name: string;
  url: string;
  description?: string;
  imageUrl?: string;
  isFavorite: boolean;
  categoryName?: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/categorias';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private favoriteItemsSubject = new BehaviorSubject<Item[]>([]);
  favoriteItems$ = this.favoriteItemsSubject.asObservable();

  constructor() {
    this.loadCategories();
  }

  private hasLoaded = false;

  private async loadCategories(): Promise<void> {
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    const categories = await firstValueFrom(this.http.get<Category[]>(this.apiUrl));
    this.categoriesSubject.next(categories);
    this.updateFavoriteItems();
  }  

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getAllItems(): Item[] {
    return this.getCategories().flatMap(category => category.items || []);
  }

  getUrlsByCategory(categoryId: string): Item[] {
    const category = this.getCategories().find(cat => cat._id === categoryId);
    return category ? category.items : [];
  }

  async addCategory(name: string, color: string): Promise<void> {
    const newCategory = { name, color, items: [] };
    await firstValueFrom(this.http.post<Category>(this.apiUrl, newCategory));
    await this.reloadCategories();
  }

  async addUrlToCategory(categoryId: string, urlItem: Omit<Item, '_id'>): Promise<void> {
    const newItem = { ...urlItem, isFavorite: urlItem.isFavorite ?? false };
    await firstValueFrom(this.http.put(`${this.apiUrl}/${categoryId}/add-url`, newItem));
    await this.reloadCategories();
  }  

  updateFavoriteItems(): void {
    const allItems = this.getAllItems();
    const favorites = allItems.filter(item => item.isFavorite);
    this.favoriteItemsSubject.next(favorites);
  }

  async toggleFavorite(categoryId: string, urlName: string): Promise<void> {
    const category = this.getCategories().find(cat => cat._id === categoryId);
    if (!category) return;

    const item = category.items.find(i => i.name === urlName);
    if (!item) return;

    item.isFavorite = !item.isFavorite;
    await firstValueFrom(this.http.put(`${this.apiUrl}/${categoryId}/update-url/${item._id}`, item));
    await this.loadCategories(); 
    this.updateFavoriteItems();  
  }

  async deleteUrl(categoryId: string, urlId: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${categoryId}/delete-url/${urlId}`));
    await this.reloadCategories();
  }
  
  async deleteCategory(categoryId: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${categoryId}`));
    await this.reloadCategories();
  }

  getCategoryNameByUrl(url: string): string | undefined {
    const category = this.getCategories().find(cat => cat.items.some(item => item.url === url));
    return category ? category.name : undefined;
  }

  async updateCategory(categoryId: string, updatedItems: Item[]): Promise<void> {
    const category = this.getCategories().find(cat => cat._id === categoryId);
    
    if (!category) {
      console.error(`No se encontró la categoría con ID: ${categoryId}`);
      return;
    }

    await firstValueFrom(this.http.put(`${this.apiUrl}/${categoryId}`, { ...category, items: updatedItems }));
  
    await this.reloadCategories();
  }

  async updateUrlInCategory(categoryId: string, updatedItem: Item): Promise<void> {
    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}/${categoryId}/update-url/${updatedItem._id}`, updatedItem));
      await this.reloadCategories();
    } catch (error) {
      console.error("Error al actualizar URL:", error);
    }
  }

  async reloadCategories(): Promise<void> {
    this.hasLoaded = false;
    await this.loadCategories();
    this.updateFavoriteItems();
  }  

  getCategoryIdByUrl(url: string): string | undefined {
    const category = this.getCategories().find(cat => cat.items.some(item => item.url === url));
    return category ? category._id : undefined;
  }
}