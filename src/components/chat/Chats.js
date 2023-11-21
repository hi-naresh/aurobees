import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { useAuth } from "../../contexts/AuthContext";
import database from "../../firebase";

const Chats = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const matchesRef = database
        .collection("users")
        .doc(currentUser.uid)
        .collection("matches");

      const unsubscribe = matchesRef.onSnapshot(async (snapshot) => {
        const matchesData = snapshot.docs.map((doc) => doc.data());
        
        // Fetch last message for each match
        const userPromises = matchesData.map(async (match) => {
          const userSnapshot = await database
            .collection("users")
            .doc(match.userId)
            .get();

          const chatId = [currentUser.uid, match.userId].sort().join('_');
          const lastMessageSnapshot = await database
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

          const lastMessage = lastMessageSnapshot.docs[0]?.data()?.text || "No messages yet";

          return { 
            ...userSnapshot.data(), 
            matchId: match.userId, 
            lastMessage 
          };
        });

        const matchedUsersData = await Promise.all(userPromises);
        setMatchedUsers(matchedUsersData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);
  
  return (
    <div className="explore-container">
      <div className="explore-header">
        <img className="header__image" src="assets/abees.png" alt="Abees" />
        <h2>Chat</h2>
        <img  height={'28px'} src="assets/search-normal.png" alt="Abees" />
      </div>
      <div 
      style={{paddingTop: "20px",}} 
      className="chats">
        {matchedUsers.map((user) => (
          <Chat
            key={user.matchId}
            name={user.name}
            message={user.lastMessage}
            timestamp={new Date().toLocaleDateString("en-US")}
            profilePic={user.photos[0]} // Assuming the first photo is what you want to show
            userId={user.matchId} // Add this line if not already present
          />
        ))}
      </div>
    </div>
  );
};

export default Chats;
