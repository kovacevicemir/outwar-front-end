import { Component, OnInit, signal } from '@angular/core';
import { InventoryComponent } from '../../components/inventory/inventory.component';
import { EquipedItemsRedoComponent } from '../../components/equiped-items-redo/equiped-items-redo.component';
import { PlayerStatsComponent } from '../../components/player-stats/player-stats.component';
import skillsDefinitions from '../../data/Skills.json';
import { SkillsServiceService } from '../../services/SkillsService.service';
import { ActiveSkill } from '../skills-page/skills-page.component';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [
    InventoryComponent,
    EquipedItemsRedoComponent,
    PlayerStatsComponent,
    MatTooltipModule,
    CommonModule,
  ],
})
export class ProfilePageComponent implements OnInit {
  allSkills = skillsDefinitions;
  user = this.playerProfileService.userSignal.asReadonly();
  public activeSkills = signal<ActiveSkill[]>([]);

  constructor(
    private playerProfileService: PlayerProfileServiceService,
    private skillsService: SkillsServiceService
  ) {}

  ngOnInit() {
    this.getAllActiveSkills();
  }

  async getAllActiveSkills() {
    const res = await this.skillsService.getAllActiveSkills('test1');
    if (res !== null) {
      this.activeSkills.set(res as ActiveSkill[]);
    }
  }

  isDisabled(skillName: string) {
    const skill = this.activeSkills().find((s) => s.skillName === skillName);
    if (skill) {
      const isActive = this.isStillActive(skill);
      if (isActive) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  
  isStillActive(skill: ActiveSkill) {
    if (skill.duration.slice(0, 2) !== '23') {
      return false;
    }
    {
      return true;
    }
  }

  getRemainingTime(timeDuration: string) {
    return `${timeDuration.slice(3, 5)}m`;
  }

  getSkillOnHoverSummary(skill: ActiveSkill) {
    const attribute = this.allSkills.find(
      (s) => s.Name === skill.skillName
    )?.Attribute;
    const timeRemaining = this.getRemainingTime(skill.duration);
    return `Skill time remaining: ${timeRemaining}  ${skill.skillName} +${skill.bonus} ${attribute}`;
  }

  getCurrentSkillBonus(index: number, skillAttribute: string) {
    const currentSkillLevel = this.user()?.skills[index];
    if (currentSkillLevel) {
      return `+${
        this.allSkills[index].LevelValues?.[currentSkillLevel - 1]
      } ${skillAttribute}`;
    }
    return 'unavailable';
  }

  getSkillImage(skillName: string) {
    return `../../../assets/skills/${skillName.toLowerCase()}.gif`;
  }
}
