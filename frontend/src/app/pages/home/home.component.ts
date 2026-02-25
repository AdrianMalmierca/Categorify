import { Component } from '@angular/core';
import { CategoryService, Category } from '../../servicios/category.service';
import { HeaderComponent } from '../../componentes/header/header.component';
import { NavBarComponent } from '../../componentes/nav-bar/nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, NavBarComponent],
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
