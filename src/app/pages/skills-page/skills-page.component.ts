import { Component, OnInit, signal } from '@angular/core';
import { PlayerProfileServiceService } from '../../services/PlayerProfileService.service';
import { CommonModule } from '@angular/common';
import skillsDefinitions from '../../data/Skills.json';
import { SkillsServiceService } from '../../services/SkillsService.service';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ActiveSkill {
  skillName: string;
  duration: string;
  bonus: number;
}

interface SkillResponseMessage {
  skillName: string;
  message: string;
}

@Component({
  selector: 'app-skills-page',
  templateUrl: './skills-page.component.html',
  styleUrls: ['./skills-page.component.css'],
  imports: [CommonModule, MatTooltipModule],
  standalone: true,
})
export class SkillsPageComponent implements OnInit {
  allSkills = skillsDefinitions;
  user = this.playerProfileService.userSignal.asReadonly();
  public activeSkills = signal<ActiveSkill[]>([]);

  skillResponseMessages: SkillResponseMessage[] = [];

  constructor(
    private playerProfileService: PlayerProfileServiceService,
    private skillsService: SkillsServiceService
  ) {}

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

  ngOnInit() {
    if (this.user() === null) {
      this.playerProfileService.getUserByUsername('test1');
    }

    this.getAllActiveSkills();
  }

  isDisabled(skillName: string) {
    const skill = this.activeSkills().find((s) => s.skillName === skillName);
    if (skill) {
      const isActive = this.isStillActive(skill);
      if (isActive === false) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  displaySkillResponseMessage(skillName: string) {
    const ResMsg = this.skillResponseMessages.find(
      (s) => s.skillName === skillName
    );
    if (ResMsg) {
      return `${ResMsg.message}`;
    } else {
      return '';
    }
  }

  getCooldownTime(skillName: string) {
    const s = this.activeSkills().find((s) => s.skillName === skillName);
    if (s) {
      return `${s.duration.slice(0, 8)}h`;
    }
    return '';
  }

  isStillActive(skill: ActiveSkill) {
    if (skill.duration.slice(0, 2) !== '23') {
      return false;
    }
    {
      return true;
    }
  }

  async getAllActiveSkills() {
    const res = await this.skillsService.getAllActiveSkills('test1');
    if (res !== null) {
      this.activeSkills.set(res as ActiveSkill[]);
    }
  }

  async increaseSkillLevel(skillName: string) {
    const res = await this.skillsService.increaseSkillLevel('test1', skillName);
    if (res !== null) {
      this.skillResponseMessages = [];
      this.skillResponseMessages.push({
        skillName,
        message: res,
      });
    }
  }

  async castSkill(skillName: string) {
    const res = await this.skillsService.castSkill('test1', skillName);
    if (res !== null) {
      this.skillResponseMessages = [];
      this.skillResponseMessages.push({
        skillName,
        message: res,
      });
    }
  }
}
