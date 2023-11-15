// sign-up.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Path adjusted

// Define an interface for the expected response to avoid using 'any'
interface UserResponse {
  uniqueId: string;
  // Add other properties expected from your backend response here
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  user = {
    name: '',
    bio: '',
    favorite_genre: ''
  };
  selectedFile: File | null = null;
  shelfOpen = false; 
  uniqueId = ''; 
  displayUniqueIdBox = false; 
  displayForm = true; 

  constructor(private http: HttpClient) {}

  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files; // Changed 'let' to 'const'
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  toggleShelf(): void {
    this.shelfOpen = !this.shelfOpen;
  }

  submitForm(): void {
    // Check if the form is valid before submitting
    if (!this.user.name) {
      alert('Name is required');
      return;
    }
    // Add any other validation you require here

    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('bio', this.user.bio || '');
    formData.append('favorite_genre', this.user.favorite_genre || '');
    if (this.selectedFile) {
      formData.append('profile_pic', this.selectedFile, this.selectedFile.name);
    }

    this.http.post<UserResponse>(`${environment.apiUrl}api/users`, formData).subscribe({
      next: (response) => {
        // Handle the display of the unique ID
        this.showUniqueId(response.uniqueId);
      },
      error: (error) => {
        console.error('There was an error!', error);
        alert('An error occurred while signing up.');
      }
    });
  }

  showUniqueId(uniqueId: string): void {
    // Hide the form when showing the unique ID box
    this.displayForm = false;
    // Set the unique ID and show the box
    this.uniqueId = uniqueId;
    this.displayUniqueIdBox = true;
  }

  hideUniqueIdBox(): void {
    // Hide the unique ID box
    this.displayUniqueIdBox = false;
    // Optionally show the form again if needed
    this.displayForm = true;
  }
}
