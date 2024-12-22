import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BehaviorSubject } from 'rxjs';
import { setupLights } from '../utils/lights.utils';
import { setupGround } from '../utils/ground.utils';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animations: THREE.AnimationClip[] = [];
  private controls!: OrbitControls;
  
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  initialize(canvas: HTMLCanvasElement) {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer(canvas);
    this.setupControls();
    
    setupLights(this.scene);
    setupGround(this.scene);
    
    this.loadModel();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
  }

  private setupCamera() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5);
  }

  private setupRenderer(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      'assets/3D/ufo.glb',
      (gltf) => this.onModelLoaded(gltf),
      undefined,
      (error) => this.onModelError(error)
    );
  }

  private onModelLoaded(gltf: any) {
    this.model = gltf.scene;
    this.centerModel();
    this.setupModelShadows();
    this.setupAnimations(gltf);
    this.loadingSubject.next(false);
  }

  private centerModel() {
    if (!this.model) return;
    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());
    this.model.position.sub(center);
    this.model.scale.set(1.5, 1.5, 1.5);
    this.scene.add(this.model);
  }

  private setupModelShadows() {
    this.model?.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  private setupAnimations(gltf: any) {
    if (!this.model) return;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.animations = gltf.animations;
    if (this.animations.length > 0) {
      this.playAnimation(0);
    }
  }

  private onModelError(error: any) {
    console.error('Error loading model:', error);
    this.loadingSubject.next(false);
  }

  playAnimation(index: number) {
    if (this.mixer && this.animations[index]) {
      this.mixer.stopAllAction();
      const action = this.mixer.clipAction(this.animations[index]);
      action.play();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.mixer) {
      this.mixer.update(0.016);
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}