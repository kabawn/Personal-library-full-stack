import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Book } from './models/book.model'; // Adjust the import path as necessary
import { environment } from '../environments/environment'; // Path adjusted

// Define interfaces for the data structures you expect from the backend
interface UserIdResponse {
  id: number;
}

interface User {
  id: number;
  name: string;
  profile_pic_url?: string;
  // Add other user properties here
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly uniqueIdKey = 'uniqueId';
  private readonly userIdKey = 'userId';

  constructor(private http: HttpClient) {}

  setUniqueId(id: string): void {
    localStorage.setItem(this.uniqueIdKey, id);
    // Whenever the uniqueId is set, also fetch and set the numeric userId
    this.fetchUserId(id);
  }

  getUniqueId(): string | null {
    return localStorage.getItem(this.uniqueIdKey);
  }

  setUserId(id: number): void {
    localStorage.setItem(this.userIdKey, id.toString());
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }

  // Fetch the numeric userId from the backend based on the uniqueId
  fetchUserId(uniqueId: string): void {
    this.http.get<UserIdResponse>(`${environment.apiUrl}/api/users/resolve/${uniqueId}`).subscribe({
      next: (data) => {
        if (data && data.id) {
          this.setUserId(data.id);
        } else {
          console.error('No user ID returned from the server.');
          this.clearUserId();
        }
      },
      error: (error) => {
        console.error('Error fetching user ID:', error);
        this.clearUserId();
      }
    });
  }

  getUserBooks(): Observable<Book[]> {
    const uniqueId = this.getUniqueId();
    if (!uniqueId) {
      return throwError(() => new Error('No unique ID set'));
    }
    return this.http.get<Book[]>(`${environment.apiUrl}/api/users/${uniqueId}/books`);
  }

  getUserDetailsById(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${userId}`);
  }
}
