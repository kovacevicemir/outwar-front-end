import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-fight-outcome',
  templateUrl: './fight-outcome.component.html',
  styleUrls: ['./fight-outcome.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FightOutcomeComponent {
  @Input() playerAttacks: number[] = [];
  @Input() monsterAttacks: number[] = [];
  @Input() playerHpLeft: number[] = [];
  @Input() monsterHpLeft: number[] = [];

  indices: number[] = [];
  visibleTurns = 0;
  intervalId: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const maxLength = Math.max(
      this.playerAttacks?.length || 0,
      this.monsterAttacks?.length || 0
    );
    this.indices = Array.from({ length: maxLength }, (_, i) => i);
    this.visibleTurns = 0;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.visibleTurns++;
      if (this.visibleTurns >= maxLength) {
        clearInterval(this.intervalId);
        this.intervalId = null; // Clean up
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.playerAttacks = [];
    this.monsterAttacks = [];
    this.playerHpLeft = [];
    this.monsterHpLeft = [];
    this.visibleTurns = 0;
  }

  normalizeAttack(attackValue: number){
    if(attackValue < 0){
      //this means crit
      return `${attackValue * -1}!`
    }else{
      return attackValue;
    }
  }

  normalizeMonsterAttack(attackValue: number){
    if(attackValue === -1){
      //this means block
      return "Block!"
    }else{
      return attackValue;
    }
  }
}
