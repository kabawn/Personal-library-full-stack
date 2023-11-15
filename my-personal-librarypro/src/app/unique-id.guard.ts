// unique-id.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UniqueIdGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.getUniqueId()) {
      return true;
    } else {
      this.router.navigate(['/']); // or the route to your entry page
      return false;
    }
  }
}
