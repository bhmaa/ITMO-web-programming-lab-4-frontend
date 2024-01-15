import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadiusService {
  private _radius = 1;
  public radiusChanged: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  public get radius(): number {
    return this._radius;
  }

  public set radius(newRadius: number) {
    this._radius = newRadius > 0 ? newRadius : this._radius;
    this.radiusChanged.emit(this._radius);
  }
}
