// MatchNotification.js
import React from 'react';
import { Avatar } from "@material-ui/core";

const MatchNotification = ({ isMatch, matchedUser, userData, onContinueSwiping, onStartConversation }) => {
  if (!isMatch || !matchedUser) return null;

  return (
    <div className="match-notification">
      <h1>It's a match!</h1>
      <div className="match-avatars"> 
        <Avatar 
          className="match-notification-avatar"
          src={matchedUser.photos[0]} 
          alt={matchedUser.name} />
        <Avatar
          className="match-notification-avatar"
          src={userData.photos ? userData.photos[0] : ''}
          alt={userData.name}
        />
      </div>
      <h2>You & {matchedUser.name} Swiped</h2>
      <button onClick={onStartConversation}>Start a conversation</button>
      <button onClick={onContinueSwiping}>Keep Swiping</button>
    </div>
  );
};

export default MatchNotification;