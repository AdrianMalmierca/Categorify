import { Component } from '@angular/core';
import { CategoryService, Category } from '../../servicios/category.service';
import { HeaderComponent } from '../../componentes/header/header.component';
import { NavBarComponent } from '../../componentes/nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { CategoryCardComponent } from "../../componentes/category-card/category-card.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, NavBarComponent, CategoryCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: Category[] = [];

  constructor(private router: Router, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  
    this.categoryService.reloadCategories();
  }  
  
  goToCategory(category: Category) {
    this.router.navigate(['/category', category._id]);
  } 
}
