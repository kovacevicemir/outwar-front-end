import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipedItemsComponent } from './equiped-items.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EquipedItemsComponent],
  exports: [EquipedItemsComponent]
})
export class EquipedItemsModule { }
