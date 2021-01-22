import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faComments,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
import Message from './Message';
import Loader from './Loader';

import vaLogo from './logo.svg';

const socket = io.connect('ws://localhost:8080', {
  transports: ['websocket'],
});

const notificationTune = new Audio('/tune.mp3');

const Chatbot = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // Greeting user
  useEffect(() => {
    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          {
            message: <Greeting1 />,
            sentBy: 'bot',
            timestamp: Date.now(),
          },
        ]),
      1000
    );

    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          {
            message: <Greeting2 />,
            sentBy: 'bot',
            timestamp: Date.now(),
          },
        ]),
      2000
    );

    // Listening on socket event
    socket.on('receive', (response) => {
      console.log('✅', response);
      setShowLoader(false);

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
    scrollView.style.height = '110px';
    scrollView.scrollIntoView({ behavior: 'smooth' });
    scrollView.style.height = '0';

    socket.emit('receive', { text: inputMsg, guid: 'v6r4luai4vfn0f7bi8afbd3' });
    setShowLoader(true);
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
          <h4 className="heading">
            <img src={vaLogo} alt="" /> RazorVA
          </h4>
          <span className="close" onClick={() => setShowChatBot(false)}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </span>
        </header>
        <div className="chat" id="chat">
          {messages.map((m, idx) => (
            <Message
              key={idx}
              start={m.sentBy === 'bot' ? 'left' : 'right'}
              timestamp={m.timestamp}
            >
              {m.message}
            </Message>
          ))}

          {showLoader && <Loader />}

          <div id="scroll-view"></div>
        </div>

        <form onSubmit={sendMessage}>
          <input
            placeholder="Type your query here"
            value={inputMsg}
            autoFocus={true}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button type="submit" className="send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
        <div className="swag">Powered by RazorVA</div>
      </div>
    </div>
  );
};

const Greeting2 = () => (
  <span>
    Here are few list of things you can do:
    <br />
    Check you payment status
    <br />
    Check your success rate
    <br />
    Last few transactions
  </span>
);

const Greeting1 = () => (
  <span>
    Hi there 👋
    <br />
    I'm the VA Razor,
    <br />
    The Worry Erasor,
    <br />
    Ask me anything you like.
  </span>
);

export default Chatbot;
