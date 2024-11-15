import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldComponent } from './world.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WorldComponent],
  exports: [WorldComponent]
})
export class WorldModule { }
