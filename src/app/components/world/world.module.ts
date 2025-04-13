import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldComponent } from './world.component';
import { HttpClientModule } from '@angular/common/http';
import { AllQuestsComponent } from '../all-quests/all-quests.component';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule, HttpClientModule, AllQuestsComponent, MatIcon
  ],
  declarations: [WorldComponent],
  exports: [WorldComponent],
})
export class WorldModule { }
