import React from "react";

const Avatar = ({
  username,
  avatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s",
  isOnline,
}) => {
  return (
    <div className={`relative ${isOnline ? "online" : ""}`}>
      <img
        src={avatarUrl}
        alt={username}
        className="h-14 w-14 rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
