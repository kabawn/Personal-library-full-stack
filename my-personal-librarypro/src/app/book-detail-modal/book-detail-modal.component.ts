import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../models/book.model';
import { UserService } from '../user.service';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment.prod'; // Path adjusted


@Component({
  selector: 'app-book-detail-modal',
  templateUrl: './book-detail-modal.component.html',
  styleUrls: ['./book-detail-modal.component.scss']
})
export class BookDetailModalComponent implements OnInit {
  @Input() bookId?: number;
  book?: Book;
  loading = false;
  selectedFile: File | null = null;
  isEditMode = false; // Flag to toggle edit mode


  newReview = {
    rating: 5, // default rating
    review: ''
  };

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }
  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBookDetails(); // Your existing method to load book details
    this.fetchReviews(); // Add this line to fetch reviews when the component initializes
  }

  loadBookDetails(): void {
    this.loading = true;
    this.http.get<Book>(`${environment.apiUrl}/api/books/${this.bookId}`).subscribe({
      next: (bookData) => {
        this.book = bookData;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load book details.');
        this.loading = false;
      }
    });
  }

  toggleEditMode(editMode: boolean): void {
    this.isEditMode = editMode;
    // If not in edit mode and the bookId is present, reload the book details
    if (!editMode && this.bookId) {
      this.loadBookDetails();
    }
  }

  onFileSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files?.length) {
      this.selectedFile = element.files[0];
    }
  }

  submitUpdate(): void {
    if (!this.book || !this.bookId) {
      this.toastr.error('Book data is not loaded.');
      return;
    }
    const userId = this.userService.getUserId();
    if (!userId) {
      this.toastr.error('User ID is missing. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('note', this.book.note);
    formData.append('user_id', userId.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.put(`${environment.apiUrl}/api/books/${this.bookId}`, formData).subscribe({
      next: () => {
        this.toastr.success('Book updated successfully.');
        this.activeModal.close('Book updated');
      },
      error: (error) => {
        this.toastr.error('Failed to update book.');
        console.error('Error updating book:', error);
      }
    });
  }
  

  deleteBook(): void {
    const userId = this.userService.getUserId(); // Retrieve the user ID
    if (!this.book || !this.book.id || !userId) {
      this.toastr.error('Missing book ID or user ID. Please try again.');
      return;
    }
  
    this.http.delete(`${environment.apiUrl}/api/books/${this.book.id}`, { params: { user_id: userId.toString() } })
      .subscribe({
        next: () => {
          this.toastr.success('Book deleted successfully.');
          this.activeModal.close('Book deleted');
          // You might want to refresh the book list in your personal library component
        },
        error: (error) => {
          this.toastr.error('Failed to delete book.');
          console.error('Error deleting book:', error);
        }
      });
  }

 


  submitReview(): void {
    if (!this.book || !this.book.id) {
      this.toastr.error('Book ID is missing.');
      return;
    }
  
    const userId = this.userService.getUserId();
    if (!userId) {
      this.toastr.error('User ID is missing.');
      return;
    }
  
    // Make the API call to submit the review
    const reviewData = {
      book_id: this.book.id,
      user_id: userId,
      rating: this.newReview.rating,
      review: this.newReview.review
    };
    
    this.http.post(`${environment.apiUrl}/api/books/${this.book.id}/reviews`, reviewData).subscribe({
      next: () => {
        this.toastr.success('Review submitted successfully!');
        this.newReview.review = ''; // Clear the review input field
        this.fetchReviews(); // Fetch the latest reviews to update the view
      },
      error: (error) => {
        this.toastr.error('Error submitting review.');
        console.error('Error submitting review:', error);
      }
    });
  }
  

  
  fetchReviews(): void {
    if (!this.bookId) {
      this.toastr.error('Book ID is missing.');
      return;
    }
  
    this.http.get<Review[]>(`${environment.apiUrl}/api/books/${this.bookId}/reviews`).subscribe({
      next: (reviews) => {
        if (this.book) {
          this.book.reviews = reviews;
        }       },
      error: (error) => {
        if (error.status === 404) {
          this.toastr.info('No reviews found for this book.');
        } else {
          this.toastr.error('Failed to load reviews.');
        }
        console.error('Error fetching reviews:', error);
      }
    });
  }
  
}

  


