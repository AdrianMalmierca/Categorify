import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlDataService {
  private selectedUrlData: any = null;

  constructor(private router: Router) {}

  setUrlData(data: any) {
    this.selectedUrlData = data;
  }

  getUrlData() {
    return this.selectedUrlData;
  }

  openDetails(item: any, categoryId: string) {
    const enrichedItem = {
      ...item,
      categoryId
    };
    this.setUrlData(enrichedItem);
    this.router.navigate(['/url-detail']);
  }
}
