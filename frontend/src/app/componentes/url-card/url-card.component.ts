import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../servicios/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-url-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './url-card.component.html',
  styleUrl: './url-card.component.css'
})
export class UrlCardComponent {
  @Input() name: string = '';
  @Input() url: string = '';
  @Input() isFavorite: boolean = false;
  @Input() imageUrl: string | null = null;
  @Input() categoryName!: string;
  
  @Output() urlClick = new EventEmitter<any>();
  @Output() remove = new EventEmitter<void>();
  @Output() toggleFavoriteEvent = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService, 
  ) {}

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavoriteEvent.emit();
  }  
  
  handleCardClick(event: Event) {
    const target = event.target as HTMLElement;

    console.log('Emitiendo objeto completo desde UrlCard:', {
      name: this.name,
      url: this.url,
      imageUrl: this.imageUrl,
      isFavorite: this.isFavorite,
      categoryName: this.categoryName
    });

    this.urlClick.emit({
      name: this.name,
      url: this.url,
      imageUrl: this.imageUrl,
      isFavorite: this.isFavorite,
      categoryName: this.categoryName
    });
  }

  removeFromFavorites(event: Event) {
    event.stopPropagation();
    this.remove.emit();
  }
}