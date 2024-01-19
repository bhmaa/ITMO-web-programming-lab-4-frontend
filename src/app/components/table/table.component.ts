import {Component, OnInit} from '@angular/core';
import {HitsService} from "../../services/hits.service";
import {Hit} from "../../model/hit";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  hits: Hit[] = [];

  constructor(private hitsService: HitsService) {
  }

  ngOnInit(): void {
    this.getHits();
    this.hitsService.reloadRequest$.subscribe(() => {
      this.getHits();
    });
  }

  getHits(): void {
    this.hitsService.getHits().subscribe(
      hits => this.hits = hits.reverse(),
      err => console.error(err)
    );
  }
}
