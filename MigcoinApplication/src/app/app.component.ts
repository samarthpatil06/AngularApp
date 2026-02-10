import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports:[RouterOutlet,CommonModule],
  standalone:true
})
export class AppComponent implements OnInit {

  ngOnInit() {}

}
