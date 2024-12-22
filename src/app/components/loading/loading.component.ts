import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading 3D Model...</div>
    </div>
  `,
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {}