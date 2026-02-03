import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  title = '';
  isMenuOpen = false;

  menuItems = [
    { label: 'Manage Account', route: '/accounts' },
    { label: 'Manage Devices', route: '/devices' },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title = this.getRouteTitle();
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private getRouteTitle(): string {
    let route = this.activatedRoute.firstChild;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.snapshot.data['title'] || '';
  }

  gotosystem() {
    console.log('button cllicked');

    this.router.navigate(['/view']);
    this.isMenuOpen = !this.isMenuOpen;
  }
}
