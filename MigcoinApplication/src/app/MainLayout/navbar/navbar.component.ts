import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  title = '';
  isMenuOpen = false;

  searchControl = new FormControl('');
  searchResults: any[] = [];
  showResults = false;

  menuItems: { label: string, route: string | null }[] = [
    { label: 'System Overview', route: '/view' },
    { label: 'Manage Account', route: '/accounts' },
    { label: 'Manage Devices', route: '/devices' },
    { label: 'Settings', route: '/settings' },
    { label: 'Reports', route: '/reports' },
    { label: 'Logout', route: null },
    { label: 'Help', route: '/help' }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Trigger title update on navigation end
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title = this.getRouteTitle();
        this.showResults = false; // Close search on navigation
      });

    // Set initial title immediately
    this.title = this.getRouteTitle();

    // Setup Search
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          this.showResults = false;
          return of([]);
        }
        return this.userService.getUsers(term);
      })
    ).subscribe({
      next: (users) => {
        this.searchResults = users;
        this.showResults = true;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.searchResults = [];
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleItemClick(item: any): void {
    if (item.label === 'Logout') {
      this.authService.logout();
    }
    this.toggleMenu();
  }

  private getRouteTitle(): string {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot.data['title'] || '';
  }

  selectUser(user: any): void {
    console.log('Selected user:', user);
    // Navigate to user details or fill form - logic depends on requirements.
    // For now, maybe just log or navigate to manage-accounts with query param?
    // Let's assume we want to view their details, maybe navigate to accounts with a filter?
    // Or just clear search. 
    this.showResults = false;
    this.searchControl.setValue(`${user.firstName} ${user.lastName}`, { emitEvent: false });
  }

  hideBox(): void {
    // Delay to allow click event on result item to register
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

}
