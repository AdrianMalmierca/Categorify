import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-category-card',
  imports: [NgStyle],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() category!: { name: string; color: string };

  ngOnChanges() {
    console.log("Recibiendo categoría en Card:", this.category); //para comprobar que se enviaban, ya que al principio no se mostraban
  }
}