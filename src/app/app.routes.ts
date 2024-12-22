import { Routes } from '@angular/router';
import { SceneComponent } from './components/scene/scene.component';

export const routes: Routes = [
  { path: '', redirectTo: 'animation/1', pathMatch: 'full' },
  { path: 'animation/:id', component: SceneComponent },
];