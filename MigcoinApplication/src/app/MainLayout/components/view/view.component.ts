import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

interface DashboardSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalDeviceModels: number;
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  data: DashboardSummary | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = 'Unable to load dashboard summary.';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getSummary().subscribe({
      next: (res: DashboardSummary) => {
        this.data = res;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  get activePercent(): number {
    if (!this.data?.totalUsers) return 0;
    return Math.round((this.data.activeUsers / this.data.totalUsers) * 100);
  }

  get inactivePercent(): number {
    if (!this.data?.totalUsers) return 0;
    return Math.round((this.data.inactiveUsers / this.data.totalUsers) * 100);
  }

  get devicePerUser(): string {
    if (!this.data?.totalUsers) return '0.00';
    return (this.data.totalDeviceModels / this.data.totalUsers).toFixed(2);
  }
}
