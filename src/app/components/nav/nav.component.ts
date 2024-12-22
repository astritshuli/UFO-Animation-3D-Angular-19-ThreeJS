import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav>
      <a [routerLink]="['/animation/1']">Animation 1</a>
      <a [routerLink]="['/animation/2']">Animation 2</a>
      <a [routerLink]="['/animation/3']">Animation 3</a>
    </nav>
  `,
  styleUrls: ['./nav.component.css']
})
export class NavComponent {}