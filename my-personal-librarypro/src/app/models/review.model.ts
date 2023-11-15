export interface Review {
    id: number; // If your reviews have an ID
    rating: number;
    review: string;
    userId: number; // Assuming each review is linked to a user
    // You can add additional properties that your reviews might have
  }