import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReviewComponent.css';

const ReviewComponent = ({ listingId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!listingId) {
        throw new Error('Listing ID is missing');
      }
      
      console.log('Fetching reviews for listing:', listingId);
      const response = await axios.get(`http://localhost:5000/api/reviews/listing/${listingId}`);
      console.log('Reviews fetched successfully:', response.data);
      setReviews(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the server is running.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load reviews';
        setError(errorMessage);
      }
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!newReview.comment.trim()) {
        setError('Please enter a comment');
        return;
      }
      
      if (!newReview.rating) {
        setError('Please select a rating');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a review');
        return;
      }

      console.log('Submitting review:', {
        listingId,
        rating: newReview.rating,
        comment: newReview.comment
      });

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          listingId,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Review submission response:', response.data);
      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setSuccess('Review submitted successfully!');
      setError('');
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Error submitting review. Please try again.';
      setError(errorMessage);
      setSuccess('');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setReviews(reviews.filter(review => review._id !== reviewId));
      setSuccess('Review deleted successfully!');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting review');
      setSuccess('');
    }
  };

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      
      {user && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-input">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <span className="star">{star <= newReview.rating ? '★' : '☆'}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="comment-input">
            <label>Comment:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      )}

      {isLoading ? (
        <div className="loading-spinner">Loading reviews...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">No reviews yet. Be the first to review!</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{review.user.firstName} {review.user.lastName}</span>
                <div className="rating-stars">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="review-comment">{review.comment}</p>
            {user && user.userId === review.user._id && (
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="delete-review-btn"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;