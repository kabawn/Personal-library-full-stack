import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '..//.//..//user.service';
import { environment } from '../../../environments/environment'; // Path adjusted

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal-component.html',
  styleUrls: ['./add-book-modal-component.scss'],
})
export class AddBookModalComponent {
  book = { title: '', author: '', note: '' };
  selectedFile: File | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private userService: UserService // Inject UserService to get the user_id
  ) {}

  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  submitBook(): void {
    if (!this.book.title || !this.book.author) {
      this.toastr.error('Title and author are required.');
      return;
    }

    // Get the user_id from UserService
    const userId = this.userService.getUserId();
    if (!userId) {
      this.toastr.error('User ID is not set. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('note', this.book.note);
    formData.append('user_id', userId.toString()); // Append the user_id to the form data
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.post(`${environment.apiUrl}/api/books`, formData).subscribe({
      next: (response) => {
        console.log('Book added:', response);
        this.toastr.success('Book added successfully!');
        this.activeModal.close({ action: 'newBookAdded', book: response });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error adding book:', error);
        this.toastr.error('Error adding book. Please try again.');
      },
    });
  }
}
