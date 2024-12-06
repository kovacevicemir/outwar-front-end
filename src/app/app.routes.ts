import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HelloWorldComponent } from './pages/hello-world/hello-world.component';
import { CrewPageComponent } from './pages/crew-page/crew-page.component';
import { DiamondCityPageComponent } from './pages/diamond-city-page/diamond-city-page.component';
import { RankingPageComponent } from './pages/ranking-page/ranking-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { BlacksmithPageComponent } from './pages/blacksmith-page/blacksmith-page.component';
import { SkillsPageComponent } from './pages/skills-page/skills-page.component';
import { ShopsPageComponent } from './pages/shops-page/shops-page.component';

export const routes: Routes = [
  { path: '', component: DefaultPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'crew', component: CrewPageComponent },
  { path: 'diamond-city', component: DiamondCityPageComponent },
  { path: 'ranking', component: RankingPageComponent },
  { path: 'blacksmith', component: BlacksmithPageComponent },
  { path: 'skills', component: SkillsPageComponent },
  { path: 'shop', component: ShopsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'hello', component: HelloWorldComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
