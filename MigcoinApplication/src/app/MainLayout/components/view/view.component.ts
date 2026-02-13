import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  totalUsers: number | null = null;
  data: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    console.log('Component loaded');

    this.dashboardService.getSummary().subscribe((res) => {
      this.data = res;
    });
  }
}
