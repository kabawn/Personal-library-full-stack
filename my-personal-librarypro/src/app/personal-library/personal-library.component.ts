import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Book } from '../models/book.model';
import { AddBookModalComponent } from '../components/add-book-modal-component/add-book-modal-component';
import { BookDetailModalComponent } from '../book-detail-modal/book-detail-modal.component';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../..//environments/environment'; // Adjust the path as necessary

@Component({
  selector: 'app-personal-library',
  templateUrl: './personal-library.component.html',
  styleUrls: ['./personal-library.component.scss']
})
export class PersonalLibraryComponent implements OnInit {
  books: Book[] = [];
  userProfileImageUrl?: string;
  searchTerm = ''; // Removed the type annotation

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.fetchBooks();
    this.fetchUserProfile();
  }


  fetchBooks(): void {
    const uniqueId = this.userService.getUniqueId();
    if (uniqueId) {
      this.http.get<Book[]>(`${environment.apiUrl}/api/users/${uniqueId}/books`).subscribe({
        next: (books) => {
          this.books = books;
        },
        error: (error) => {
          console.error('Error fetching books:', error);
          alert('Error fetching books. Please try again.');
        }
      });
    } else {
      console.error('Unique ID not set');
      this.router.navigate(['/']);
      alert('No unique ID found. Please enter your unique ID to view your library.');
    }
  }

  fetchUserProfile(): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserDetailsById(userId).subscribe({
        next: (user) => {
          this.userProfileImageUrl = user.profile_pic_url;
        },
        error: (error) => {
          console.error('Error fetching user profile by ID:', error);
        }
      });
    }
  }

  searchBooks(): void {
    const userId = this.userService.getUserId(); // Get the current user's ID
    if (!userId) {
      this.toastr.error('User ID is not available. Please log in again.');
      // Redirect to login or handle as appropriate
      return;
    }
  
    if (this.searchTerm.trim()) {
      // Call the search API with the searchTerm and user_id
      this.http.get<Book[]>(`${environment.apiUrl}/api/books/search`, { params: { searchTerm: this.searchTerm.trim(), user_id: userId.toString() } })
        .subscribe({
          next: (books) => {
            this.books = books; // Update the books array with the search result
          },
          error: (error) => {
            console.error('Error searching for books:', error);
            // Handle the error appropriately
          }
        });
    } else {
      this.fetchBooks(); // If the search term is empty, fetch all books again
    }
  }



  openAddBookModal() {
    const modalRef = this.modalService.open(AddBookModalComponent);
    modalRef.result.then(
      (result) => {
        // Check for the specific action to refresh the books list
        if (result && result.action === 'newBookAdded') {
          this.fetchBooks(); // Refresh the list of books
          alert('The book has been successfully added to your library.');
        }
      },
      (reason) => {
        console.log('Add Book Modal dismissed', reason);
      }
    );
  }

  openBookDetailModal(book: Book): void {
    const modalRef = this.modalService.open(BookDetailModalComponent);
    modalRef.componentInstance.bookId = book.id; // Assuming book has an 'id' property

    modalRef.result.then((result) => {
      if (result === 'Book deleted' || result === 'Book updated') {
        // If a book was deleted, refresh the book list
        this.fetchBooks();
      }
    }, (reason) => {
      // Handle the dismiss reason if needed
      console.log(`Dismissed: ${reason}`);
    });
  }
}
