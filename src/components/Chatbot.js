import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faComments,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Message from './Message';

const Chatbot = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  const handleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  const arr = new Array(20);
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
        <div className="chat">
          {Array.from({ length: 20 }).map((_, idx) => (
            <Message start={idx % 2 === 0 ? 'left' : 'right'}>
              This is a message
            </Message>
          ))}
        </div>
        <div>
          <input placeholder="Type your query here" />
          <button class="send">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        <div className="swag">Powered by Razorbot</div>
      </div>
    </div>
  );
};

export default Chatbot;
