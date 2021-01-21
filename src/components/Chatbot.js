import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faComments,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import socketIOClient from 'socket.io-client';
import Message from './Message';

const ENDPOINT = 'http://127.0.0.1:8080/socket.io/';

const Chatbot = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [inputMsg, setInputMsg] = useState('');

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('reply', (data) => {
      setMessages((m) => [
        ...m,
        { timestamp: data.timestamp, message: data, sentBy: 'bot' },
      ]);
      console.log('✅', data);
      document
        .getElementById('scroll-view')
        .scrollIntoView({ behavior: 'smooth' });
    });

    return () => socket.disconnect();
  }, []);

  const handleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMsg === '') {
      return;
    }
    const socket = socketIOClient(ENDPOINT);

    setMessages((m) => [
      ...m,
      { timestamp: Date.now(), message: inputMsg, sentBy: 'user' },
    ]);
    setInputMsg('');
    document
      .getElementById('scroll-view')
      .scrollIntoView({ behavior: 'smooth' });

    socket.emit('send', inputMsg);
  };

  return (
    <div className="chatbot-wrapper">
      <div
        className={`chatbot-button ${
          !showChatBot ? 'animate__animated animate__fadeIn' : ''
        }`}
        onClick={handleChatBot}
        style={{ display: `${showChatBot ? 'none' : 'block'}` }}
      >
        {/* <span className="notification">1</span> */}
        <FontAwesomeIcon icon={faComments} />
      </div>

      <div
        className={`chatbot-body${
          showChatBot ? ' active animate__animated animate__fadeIn' : ''
        }`}
      >
        <header>
          <h4>Chatbot</h4>
          <span className="close" onClick={() => setShowChatBot(false)}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </span>
        </header>
        <div className="chat" id="chat">
          {messages.map((m, idx) => (
            <Message start={m.sentBy === 'bot' ? 'left' : 'right'}>
              {m.message}
            </Message>
          ))}
          <div id="scroll-view"></div>
        </div>

        <form onSubmit={sendMessage}>
          <input
            placeholder="Type your query here"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button type="submit" class="send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
        <div className="swag">Powered by Razorbot</div>
      </div>
    </div>
  );
};

export default Chatbot;
