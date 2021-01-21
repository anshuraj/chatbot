import React from "react";

const Message = ({ children, start }) => {
  return (
    <div className={`message-wrapper ${start}`}>
      <span className="user">{start === "left" ? "Chatbot" : "You"}</span>
      <div className={`message`}>{children}</div>
    </div>
  );
};

export default Message;
