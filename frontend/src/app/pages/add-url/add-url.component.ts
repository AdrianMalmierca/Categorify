import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../servicios/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-url',
  imports: [FormsModule],
  templateUrl: './add-url.component.html',
  styleUrl: './add-url.component.css'
})
export class AddUrlComponent {
  categoryId!: string;
  name: string = '';
  url: string = '';
  description: string = '';
  imageUrl: string = '';
  isFavorite: boolean = false;
  
  showErrorPopup = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId') || '';
    });
  }

  goBack() {
    this.router.navigate(['/category', this.categoryId]);
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async addUrl() {
    if (this.name.trim() && this.url.trim()) {
      await this.categoryService.addUrlToCategory(this.categoryId, {
        name: this.name,
        url: this.url,
        description: this.description || '',
        imageUrl: this.imageUrl || '',
        isFavorite: this.isFavorite
      });

      this.router.navigate(['/category', this.categoryId]);
    } else {
      this.showErrorPopup = true;
    }
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }
}