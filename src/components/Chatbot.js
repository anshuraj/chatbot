import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faComments,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
import Message from './Message';

// const ENDPOINT = 'http://127.0.0.1:8080/socket.io/';
// const API_URL = 'http://localhost:5000';

const socket = io.connect('ws://localhost:8080', {
  transports: ['websocket'],
});

const notificationTune = new Audio('/tune.mp3');

const Chatbot = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive', (response) => {
      console.log('✅', response);
      setMessages((m) => [
        ...m,
        { timestamp: Date.now(), message: response.text, sentBy: 'bot' },
      ]);
      notificationTune.play();
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

    setMessages((m) => [
      ...m,
      { timestamp: Date.now(), message: inputMsg, sentBy: 'user' },
    ]);
    setInputMsg('');

    const scrollView = document.getElementById('scroll-view');
    scrollView.style.height = '65px';
    scrollView.scrollIntoView({ behavior: 'smooth' });
    scrollView.style.height = '0';

    socket.emit('receive', { text: inputMsg, guid: 'v6r4luai4vfn0f7bi8afbd3' });
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
            <Message key={idx} start={m.sentBy === 'bot' ? 'left' : 'right'}>
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
          <button type="submit" className="send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
        <div className="swag">Powered by Razorbot</div>
      </div>
    </div>
  );
};

export default Chatbot;
