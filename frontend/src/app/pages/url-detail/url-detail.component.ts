import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlDataService } from '../../servicios/url-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../servicios/category.service';

@Component({
  selector: 'app-url-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './url-detail.component.html',
  styleUrl: './url-detail.component.css'
})
export class UrlDetailComponent {
  urlData: any = null;
  showDeletePopup = false;
  showSavePopup = false;

  constructor(private router: Router, private urlDataService: UrlDataService, private categoryService: CategoryService, private route: ActivatedRoute) {}

  ngOnInit() {
    const data = this.urlDataService.getUrlData();
  
    if (!data) {
      console.error("Error: No se encontró datos en UrlDataService. Redirigiendo...");
      this.router.navigate(['/home']);
      return;
    }
  
    console.log("Datos en detalle:", data);
  
    this.urlData = data;
  }

  goBack() {
    window.history.back();
  }

  openDeletePopup() {
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
  }

  async deleteUrl() {
    if (this.urlData?.categoryId && this.urlData?._id) {
      await this.categoryService.deleteUrl(this.urlData.categoryId, this.urlData._id);
      this.router.navigate(['/']);
    } else {
      console.error("Faltan datos necesarios para eliminar la URL.");
    }
  }   

  saveChanges() {
    if (this.urlData && this.urlData.categoryId) {
      this.categoryService.updateUrlInCategory(this.urlData.categoryId, this.urlData);
      this.showSavePopup = true;
  
      setTimeout(() => this.closeSavePopup(), 1500);
    } else {
      console.error("Error: categoryId es undefined. No se puede guardar.");
    }
  }  

  closeSavePopup() {
    this.showSavePopup = false;
    this.router.navigate([`/home`]);
  }
}