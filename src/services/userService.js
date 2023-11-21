import { database } from "../firebase";

// Function to get user's own profile
export const getUserProfile = async (userId) => {
  const userRef = database.collection('users').doc(userId);
  const doc = await userRef.get();
  if (!doc.exists) {
    throw new Error('User does not exist.');
  }
//   console.log('User Profile:', doc.data());
  return doc.data();
};

// Function to update user's profile
export const updateUserProfile = async (userId, profileData) => {
  const userRef = database.collection('users').doc(userId);
  await userRef.update(profileData);
};

export const getPotentialMatches = async (userId) => {
    const userProfile = await getUserProfile(userId);
    const { genderInterest } = userProfile;
  
    // console.log('Fetching for gender:', genderInterest, userId);
  
    const potentialMatchesQuery = database.collection('users')
      .where('gender', '==', genderInterest);
  
    const snapshot = await potentialMatchesQuery.get();
  
    const potentialMatches = snapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter(user => user.id !== userId); // Exclude the current user here
  
    // console.log('Potential Matches:', potentialMatches);
    return potentialMatches;
  };
  

// Function to get a list of users for the swipe functionality
export const getSwipeableUsers = async (userId) => {
    const potentialMatches = await getPotentialMatches(userId);
  
    // Fetch the swipe history of the current user
    const swipesRef = database.collection('users').doc(userId).collection('swipes');
    const swipesSnapshot = await swipesRef.get();
  
    // Create a set of userIds that have been swiped on
    const swipedUserIds = new Set();
    swipesSnapshot.forEach(doc => {
      swipedUserIds.add(doc.id); // Assuming the document ID is the swiped user's ID
    });
  
    // Filter out users that have already been swiped on
    return potentialMatches.filter(user => !swipedUserIds.has(user.id));
  };