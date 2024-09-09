import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-preview',
  templateUrl: './custom-preview.component.html',
  styleUrls: ['./custom-preview.component.css']
})
export class CustomPreviewComponent implements OnInit {
  @Input() value: string;

  constructor() {}

  ngOnInit() {}
}
