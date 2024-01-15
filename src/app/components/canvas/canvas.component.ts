import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {HitsService} from "../../services/hits.service";
import {Hit} from "../../model/hit";
import {RadiusService} from "../../services/radius.service";

@Component({
  selector: 'app-canvas',
  template: `
    <canvas #canvasElement width="400px" height="400px" (click)="canvasClick($event)"></canvas>`,
  styles: `canvas {cursor: crosshair;}`
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  radiusReal = 1;
  multiplier = 100;
  radiusDrawn = this.radiusReal * this.multiplier;

  constructor(
    private hitsService: HitsService,
    private radiusService: RadiusService
  ) {
  }

  ngOnInit() {
    this.hitsService.reloadRequest$.subscribe(() => this.loadAndDrawPoints());
    this.radiusService.radiusChanged.subscribe((newRadius: number) => {
      this.radiusReal = newRadius;
      this.radiusDrawn = this.radiusReal * this.multiplier;
      this.drawArea();
      this.loadAndDrawPoints();
    });
  }

  ngAfterViewInit() {
    this.ctx = this.canvasElement.nativeElement.getContext('2d');
    this.drawArea();
    this.loadAndDrawPoints();
  }

  loadAndDrawPoints() {
    this.hitsService.getHits().subscribe((hits: Hit[]) => {
      if (!this.ctx) {
        return;
      }
      this.ctx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      this.drawArea();
      hits.forEach(hit => {
        this.drawPoint(hit);
      });
    });
  }

  drawArea() {
    if (!this.ctx) {
      return;
    }
    const halfRadius = this.radiusDrawn / 2;
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.save();
    this.ctx.translate(this.canvasElement.nativeElement.width / 2, this.canvasElement.nativeElement.height / 2);
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(-200, -200, 400, 400);
    this.ctx.fillStyle = '#8a6ffa';
    // circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, halfRadius, 0, -Math.PI / 2, true);
    this.ctx.lineTo(0, 0);
    this.ctx.fill();
    // rectangle
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.radiusDrawn, halfRadius);
    this.ctx.fill();
    // triangle
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-this.radiusDrawn, 0);
    this.ctx.lineTo(0, this.radiusDrawn);
    this.ctx.lineTo(0, 0);
    this.ctx.fill();
    // axes
    this.ctx.beginPath();
    this.drawArrow(-200, 0, 200, 0);
    this.drawArrow(0, 200, 0, -200);
    this.ctx.font = '10px monospace'
    this.ctx.fillText('-R', -this.radiusDrawn, 0);
    this.ctx.fillText('R', this.radiusDrawn, 0);
    this.ctx.fillText('-R/2', -halfRadius, 0);
    this.ctx.fillText('R/2', halfRadius, 0);
    this.ctx.fillText('R/2', 0, -halfRadius);
    this.ctx.fillText('R', 0, -this.radiusDrawn);
    this.ctx.fillText('-R/2', 0, halfRadius);
    this.ctx.fillText('-R', 0, this.radiusDrawn);
    this.ctx.restore();
  }

  drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
    if (!this.ctx) {
      return;
    }
    const headlen = 10;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  drawPoint(hit: Hit) {
    if (!this.ctx) {
      return;
    }
    const color = hit.hit ? '#5fba7d' : '#f76c6c';
    this.ctx.save();
    this.ctx.translate(this.canvasElement.nativeElement.width / 2, this.canvasElement.nativeElement.height / 2);
    this.ctx.beginPath();
    this.ctx.arc((hit.x / hit.r) * this.radiusDrawn, -(hit.y / hit.r) * this.radiusDrawn,
      3, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  canvasClick(event: MouseEvent) {
    const rect = this.canvasElement.nativeElement.getBoundingClientRect();
    const scaleX = this.canvasElement.nativeElement.width / rect.width;
    const scaleY = this.canvasElement.nativeElement.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;
    const centerX = this.canvasElement.nativeElement.width / 2;
    const centerY = this.canvasElement.nativeElement.height / 2;
    let x = (canvasX - centerX) / this.multiplier;
    let y = -(canvasY - centerY) / this.multiplier;

    this.hitsService.addHit({x: x.toString(), y: y.toString(), r: this.radiusReal.toString()})
      .subscribe({
        next: (hit: Hit) => {
          this.drawPoint(hit);
        },
        error: (error) => {
          console.error('Failed to add hit:', error);
        },
      });
  }
}
