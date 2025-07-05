"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

const API_KEY = "remove";

const PoliBot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]); // Store current conversation
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    {
      id: number;
      conversation: { role: string; text: string }[];
    }[]
  >([]); // Store chat history with each conversation

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Clear input immediately after sending
    const userMessage = message; // Store message to send before clearing input
    setMessage(""); // Clear input field

    // Add user message to the current conversation
    setConversation((prev) => [...prev, { role: "user", text: userMessage }]);

    let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      });

      const resjson = await res.json();
      const chatbotResponse =
        resjson.candidates[0]?.content?.parts[0]?.text || "No response";

      // Add bot message to the current conversation
      setConversation((prev) => [
        ...prev,
        { role: "bot", text: chatbotResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setConversation((prev) => [
        ...prev,
        { role: "bot", text: "Error fetching the response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Function to save the current conversation to history
  const saveConversation = () => {
    if (conversation.length > 0) {
      const newHistoryEntry = {
        id: Date.now(), // Unique ID based on timestamp
        conversation: [...conversation],
      };

      // Check if the conversation already exists in chat history
      const existingConversation = chatHistory.find(
        (history) =>
          JSON.stringify(history.conversation) ===
          JSON.stringify(newHistoryEntry.conversation)
      );

      // Only save if it does not already exist
      if (!existingConversation) {
        setChatHistory((prev) => [...prev, newHistoryEntry]);
      }
    }
  };

  // Function to load a conversation from history
  const loadConversation = (id: number) => {
    // Save current conversation before loading new one
    if (conversation.length > 0) {
      saveConversation(); // Save the current conversation
    }

    const selectedConversation = chatHistory.find(
      (history) => history.id === id
    );
    if (selectedConversation) {
      setConversation(selectedConversation.conversation);
    }
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    if (conversation.length > 0) {
      saveConversation(); // Save the current conversation before starting a new one
    }
    setConversation([]); // Clear the current conversation for a new one
  };

  return (
    <div className={styles.container}>
      {/* Chat conversation section */}
      <div className={styles.chatArea}>
        <div className={styles.conversation}>
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.role === "user" ? styles.user : styles.bot
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input section */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Chat history section (now on the right) */}
      <div className={styles.history}>
        <h3>Chat History</h3>
        {chatHistory.map((historyEntry) => (
          <button
            key={historyEntry.id}
            onClick={() => loadConversation(historyEntry.id)} // Load conversation on click
            className={styles.historyButton}
          >
            Conversation {new Date(historyEntry.id).toLocaleString()}
          </button>
        ))}

        {/* Button to start a new conversation */}
        <button onClick={startNewConversation} className={styles.newChatButton}>
          Start New Chat
        </button>
      </div>
    </div>
  );
};

export default PoliBot;
