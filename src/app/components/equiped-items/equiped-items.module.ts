import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipedItemsComponent } from './equiped-items.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  declarations: [EquipedItemsComponent],
  exports: [EquipedItemsComponent]
})
export class EquipedItemsModule { }
