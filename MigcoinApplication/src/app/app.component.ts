import { Component, HostListener, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MigcoinApplication';
  showInstallBanner = false;
  showIosInstallHelp = false;

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private readonly dismissedKey = 'pwa_install_dismissed';
  private readonly installedKey = 'pwa_installed';

  ngOnInit(): void {
    if (this.isStandaloneMode() || this.wasDismissed() || this.wasInstalled()) {
      return;
    }

    if (this.isIosSafari()) {
      this.showIosInstallHelp = true;
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event): void {
    const installEvent = event as BeforeInstallPromptEvent;
    installEvent.preventDefault();

    if (this.isStandaloneMode() || this.wasDismissed() || this.wasInstalled()) {
      return;
    }

    this.deferredPrompt = installEvent;
    this.showInstallBanner = true;
  }

  @HostListener('window:appinstalled')
  onAppInstalled(): void {
    localStorage.setItem(this.installedKey, 'true');
    this.showInstallBanner = false;
    this.showIosInstallHelp = false;
    this.deferredPrompt = null;
  }

  async installApp(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }

    await this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      localStorage.setItem(this.installedKey, 'true');
      this.showInstallBanner = false;
      this.showIosInstallHelp = false;
    }

    this.deferredPrompt = null;
  }

  dismissInstallPrompt(): void {
    localStorage.setItem(this.dismissedKey, 'true');
    this.showInstallBanner = false;
    this.showIosInstallHelp = false;
    this.deferredPrompt = null;
  }

  private wasDismissed(): boolean {
    return localStorage.getItem(this.dismissedKey) === 'true';
  }

  private wasInstalled(): boolean {
    return localStorage.getItem(this.installedKey) === 'true';
  }

  private isStandaloneMode(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  }

  private isIosSafari(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
    return isIos && isSafari;
  }
}
