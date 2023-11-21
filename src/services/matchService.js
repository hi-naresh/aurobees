import { database } from '../firebase';


export const checkForMatch = async (currentUserId, swipedUserId) => {
  // Get current user's swipe on the swiped user
  const currentUserSwipeRef = database.collection('users').doc(currentUserId).collection('swipes').doc(swipedUserId);
  const currentUserSwipeDoc = await currentUserSwipeRef.get();

  // Get swiped user's swipe on the current user
  const swipedUserSwipeRef = database.collection('users').doc(swipedUserId).collection('swipes').doc(currentUserId);
  const swipedUserSwipeDoc = await swipedUserSwipeRef.get();

  // Check for a match
  if (currentUserSwipeDoc.exists && swipedUserSwipeDoc.exists) {
    const currentUserSwipe = currentUserSwipeDoc.data();
    const swipedUserSwipe = swipedUserSwipeDoc.data();
    return currentUserSwipe.direction === 'right' && swipedUserSwipe.direction === 'right';
  }
  return false;
};

// matchService.js

export const recordMatch = async (userId, matchedUserId) => {
  // Reference to the current user's matches collection
  const userMatchesRef = database.collection('users').doc(userId).collection('matches');
  const matchRef = userMatchesRef.doc(matchedUserId);

  // Add the matched user's ID to the current user's matches collection
  await matchRef.set({
    userId: matchedUserId,
    timestamp: new Date(),
  });

  // Optionally, you could also update the matched user's matches collection to include the current user
  const matchedUserMatchesRef = database.collection('users').doc(matchedUserId).collection('matches');
  const matchedMatchRef = matchedUserMatchesRef.doc(userId);
  await matchedMatchRef.set({
    userId,
    timestamp: new Date(),
  });
};
