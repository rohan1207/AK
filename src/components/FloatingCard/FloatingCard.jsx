import React from "react";
import "./FloatingCard.scss";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";

const FloatingCard = ({ text, position, visible }) => {
  const { isDarkRoom } = useToggleRoomStore();

  const cardClassNames = `floating-card${!isDarkRoom ? " light" : ""}${
    visible ? " visible" : ""
  }`;

  const style = {
    left: `${position[0]}px`,
    top: `${position[1]}px`,
  };

  return (
    <div className={cardClassNames} style={style}>
      {text}
    </div>
  );
};

export default FloatingCard;
