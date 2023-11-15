import { Review } from "./review.model";

export interface Book {
  id: number; // Include this line if your books have an ID and it's returned by the backend
  title: string;
  author: string;
  note: string;
  image_url: string;
  last_modified?: Date; // Use optional if last_modified might not be present
  // Include any other properties that a book might have
  reviews?: Review[]; // Make it optional if it may not be present

}