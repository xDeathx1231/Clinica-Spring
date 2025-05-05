import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private routerSubscription?: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log('NavigationEnd event occurred:', event);
          // Aquí puedes realizar acciones después de que la navegación haya terminado
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe(); // Asegúrate de liberar el recurso
    }
  }
}
