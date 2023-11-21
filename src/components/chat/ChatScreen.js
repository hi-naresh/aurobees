import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sendMessage, listenForNewMessages } from "../../services/chatService";
import "./ChatScreen.css";
import { Avatar, IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import database from "../../firebase"; // Ensure this import is correct

const ChatScreen = () => {
  const { userId } = useParams();
  const history = useHistory();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [matchedUser, setMatchedUser] = useState(null);
  const messageEndRef = useRef(null);

  const chatId =
    currentUser && userId ? [currentUser.uid, userId].sort().join("_") : null;

  useEffect(() => {
    if (userId) {
      const fetchMatchedUser = async () => {
        try {
          const userDoc = await database.collection("users").doc(userId).get();
          if (userDoc.exists) {
            setMatchedUser(userDoc.data());
          } else {
            console.error("Matched user not found");
          }
        } catch (error) {
          console.error("Error fetching matched user: ", error);
        }
      };
      fetchMatchedUser();
    }
  }, [userId]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = listenForNewMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        await sendMessage(currentUser.uid, currentUser.uid, input, userId);
        setInput("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className="chatScreen-container">
      <div className="chatScreen-header">
        <IconButton onClick={handleBack}>
          <ArrowBackIosIcon />
        </IconButton>
        {matchedUser && (
          <>
          <div className="detail"> 
            <Avatar
              src={matchedUser.photos[0]}
              className="chatScreen-avatar"
            />
            <h2>{matchedUser.name}</h2>
          </div>
          </>
        )}
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>
      <div className="chatScreen-body">
        {matchedUser && (
          <p className="chatScreen__timestamp">
            YOU MATCHED WITH {matchedUser.name.toUpperCase()} ON 10/08/2021
          </p>
        )}
        {messages.map((message, index) => (
          <div key={index} className="chatScreen__message">
            <p
              className={`chatScreen__text ${
                message.senderId === currentUser.uid
                  ? "chatScreen__textUser"
                  : ""
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <form className="chatScreen__input" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chaScreen__inputFeild"
          placeholder="Type a message..."
          type="text"
        />
        <button type="submit" className="chatScreen__inputButton">
          SEND
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
