import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:8080");

const App = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("messageBackend", (data) => {
      setMessages(data);
    });
    return () => {};
  }, []);

  const handleSend = () => {
    socket.emit("messageFront", { email, message });
    setEmail("");
    setMessage("");
  };

  const verifySend = () => {
    const emailComplete = email === "" ? true : false;
    const messageComplete = message === "" ? true : false;
    return emailComplete || messageComplete ? true : false;
  };

  return (
    <div className="container">
      <div className="card-messages">
        <h1>Centro de Mensajes</h1>
        <input
          type="text"
          placeholder="ingrese el email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <hr />
        <div className="container-messages">
          {messages.map((message, index) => (
            <div className="card-message" key={index}>
              <span className="message-email">{message.email}</span>
              <span className="message-date"> [{message.date}]</span>
              <span className="message-text"> : {message.message}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="ingresá un mensaje"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          onClick={() => {
            handleSend();
          }}
          disabled={verifySend()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default App;
