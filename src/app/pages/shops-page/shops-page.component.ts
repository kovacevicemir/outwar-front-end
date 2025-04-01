import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import shopItems from '../../data/ShopItems.json';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface resMessage{
  name: string,
  msg: string
}

@Component({
  selector: 'app-shops-page',
  templateUrl: './shops-page.component.html',
  styleUrls: ['./shops-page.component.css'],
  standalone: true,
  imports:[MatButtonModule, MatCardModule, CommonModule]
})
export class ShopsPageComponent implements OnInit {

  shopItems = shopItems
  resMessages: resMessage[] = []

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  displayResMsg(itemName: string){
    const t = this.resMessages.find(m => m.name === itemName);
    return t?.msg
  }

  async purchaseItem(itemName: string): Promise<any> {
    const url = `${environment.baseUrl}/buy-item-from-shop?username=test1&itemName=${itemName}`;
    try {
      const response = await this.http.post(url, null).toPromise();
      if(response){
        this.resMessages.push({name:itemName, msg: response as string})
      }
    } catch (error) {
      console.error('Error upgrading item:', error);
      throw error;
    }
  }

}
