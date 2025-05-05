import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Variable que indica si estamos en la página de inicio (home)
  isHome: boolean = false;

  // Observar cambios de ruta
  private routerSubscription?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Suscribirse a los cambios de ruta
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(event.url);
      }
    });
  }

  ngOnDestroy(): void {
    // Evitar fugas de memoria al desuscribirnos de la ruta
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Función que verifica la ruta actual
  checkCurrentRoute(url: string): void {
    // Verifica si la ruta actual es la página de inicio (home)
    this.isHome = url === '/home';
  }
}
