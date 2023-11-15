import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment'; // Path adjusted

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  enteredUniqueId = '';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  openSignUpModal() {
    this.modalService.open(SignUpComponent, {
      centered: true,
      size: 'lg'
    });
  }

  enterLibrary() {
    // Use the apiUrl from the environment configuration
    this.http.get(`${environment.apiUrl}/api/users/${this.enteredUniqueId}/books`).subscribe({
      next: (/* books */) => { // Variable books is assumed to be used here
        // If the unique ID is valid, navigate to the personal library
        this.userService.setUniqueId(this.enteredUniqueId);
        this.router.navigate(['/personal-library']);
      },
      error: (error) => {
        console.error('Error fetching books:', error);
        alert('Invalid Unique ID or user does not have a library.');
      }
    });
  }
}
