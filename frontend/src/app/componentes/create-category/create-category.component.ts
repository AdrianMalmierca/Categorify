import { Component } from '@angular/core';
import { CategoryService } from '../../servicios/category.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-create-category',
  imports: [FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {
  categoryName: string = '';
  categoryColor: string = '#ffffff';

  @ViewChild('colorPicker') colorPicker!: ElementRef;

  constructor(private categoryService: CategoryService, public router: Router) {}

  openColorPicker() {
    this.colorPicker.nativeElement.click();
  }

  updateColor(event: any) {
    this.categoryColor = event.target.value;
  }

  saveCategory() {
    if (this.categoryName.trim()) {
      this.categoryService.addCategory(this.categoryName, this.categoryColor);
      console.log("Categoría guardada:", this.categoryName, this.categoryColor);  //al principio no funcionaba bien al mostrar en el home, por lo que comprobaba si se guardaba en el localStorage
      this.router.navigate(['/home']);
    }
  }
}