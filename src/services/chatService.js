import { database, firebase } from '../firebase';

const generateChatId = (user1Id, user2Id) => {
  // Consistently order the user IDs to generate the same chatId for the same pair of users
  return [user1Id, user2Id].sort().join('_');
};

const ensureChatSessionExists = async ( user1Id, user2Id) => {
  const chatId = generateChatId(user1Id, user2Id);

  const chatRef = database.collection('chats').doc(chatId);
  const doc = await chatRef.get();
  
  if (!doc.exists) {
    await chatRef.set({
      participants: [user1Id, user2Id],
      lastMessage: "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
};

export const sendMessage = async (user1Id, senderId, text, user2Id) => {
  const chatId = generateChatId(user1Id, user2Id);

  await ensureChatSessionExists( user1Id, user2Id);

  const messageRef = database.collection('chats').doc(chatId).collection('messages');

  await messageRef.add({
      senderId,
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Update last message and timestamp in the chat document
  await database.collection('chats').doc(chatId).update({
      lastMessage: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
};

export const listenForNewMessages = (chatId, onNewMessage) => {
  return database.collection('chats').doc(chatId).collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messages = [];
      snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
      onNewMessage(messages);
    });
};

