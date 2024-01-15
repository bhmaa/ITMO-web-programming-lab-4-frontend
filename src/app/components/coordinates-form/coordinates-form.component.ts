import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HitsService} from "../../services/hits.service";
import {RadiusService} from "../../services/radius.service";

@Component({
  selector: 'app-coordinates-form',
  templateUrl: './coordinates-form.component.html',
  styleUrls: ['./coordinates-form.component.css']
})
export class CoordinatesFormComponent {
  coordinates = {
    x: '0',
    y: '',
    r: '1'
  };

  xOptions = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];
  rOptions = this.xOptions;

  constructor(private http: HttpClient,
              private hitsService: HitsService,
              private radiusService: RadiusService) {
  }

  isRPositive() {
    return parseFloat(this.coordinates.r) > 0;
  }

  onSubmit(coordinatesForm: NgForm) {
    if (coordinatesForm.valid && this.isRPositive()) {
      this.hitsService.addHit(this.coordinates).subscribe({
        next: (result) => {
          console.log('Hit added:', result);
        },
        error: (error) => {
          console.error('Error adding hit:', error);
        }
      });
    }
  }

  onClear() {
    this.hitsService.clearHits().subscribe({
      next: (result) => {
        console.log('Hits cleared:', result);
      },
      error: (error) => {
        console.error('Error clearing hits:', error);
      }
    });
  }

  onRadiusChange() {
    let newRadiusValue = parseFloat(this.coordinates.r);
    this.radiusService.radius = this.isRPositive() ? newRadiusValue : this.radiusService.radius;
  }
}
