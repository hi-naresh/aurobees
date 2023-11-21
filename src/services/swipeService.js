import { database } from "../firebase";

export const recordSwipe = async (userId, swipedUserId, direction) => {
    const swipeRef = database.collection('users').doc(userId).collection('swipes').doc(swipedUserId);
    console.log(`Recording swipe. User: ${userId}, Swiped User: ${swipedUserId}, Direction: ${direction}`); // Add this line

    await swipeRef.set({
        direction,
        timestamp: new Date(),
    });
};

