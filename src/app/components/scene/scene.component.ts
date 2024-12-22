import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreeService } from '../../services/three.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <canvas #canvas></canvas>
    <app-loading *ngIf="threeService.loading$ | async"></app-loading>
    <div class="info-text">Drag to rotate • Scroll to zoom</div>
  `,
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    public threeService: ThreeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const animationIndex = parseInt(params['id']) - 1;
      if (!isNaN(animationIndex)) {
        this.threeService.playAnimation(animationIndex);
      }
    });
  }

  ngAfterViewInit() {
    this.threeService.initialize(this.canvasRef.nativeElement);
    this.threeService.animate();
  }
}