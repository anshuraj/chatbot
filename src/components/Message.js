import React from 'react';

const Message = ({ children, start, timestamp }) => {
  const date = new Date(timestamp);
  const time = date.getHours() + ':' + date.getMinutes();
  return (
    <div className={`message-wrapper ${start}`}>
      <span className="user">{start === 'left' ? 'RazorVA' : 'You'}</span>
      <div className={`message`}>{children}</div>
      <div className="time">{time}</div>
    </div>
  );
};

export default Message;
