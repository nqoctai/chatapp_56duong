import { Avatar } from "@mui/material";
import React from "react";

const ActiveUserList = ({ currentUser, activeUsers }) => {
  console.log("CurrentUser", currentUser);
  console.log("ActiveUserList", activeUsers);
  if (!activeUsers || activeUsers.length === 0) {
    return (
      <div>
        <div className="px-4 pb-2 text-lg font-medium">Active users</div>
        <div className="flex w-full overflow-x-auto border-b border-gray-200 p-2">
          {/* Current user */}
          <div className="px-1 text-center">
            <Avatar className="!bg-primary-main">
              {currentUser?.username?.[0]?.toUpperCase()}
            </Avatar>
            {/* <Avatar
              avatarUrl={currentUser?.avatarUrl}
              username={currentUser?.username}
              isOnline={true}
            /> */}
            <small className="block text-sm">You</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pb-2 text-lg font-medium">Active users</div>
      <div className="flex w-full overflow-x-auto border-b border-gray-200 p-2">
        {/* Current user */}
        <div className="px-1 text-center">
          <Avatar className="!bg-primary-main">
            {currentUser?.username?.[0]?.toUpperCase()}
          </Avatar>
          {/* <Avatar
            avatarUrl={currentUser?.avatarUrl}
            username={currentUser?.username}
            isOnline={true}
          /> */}
          <small className="block text-sm">You</small>
        </div>

        {/* Other active users */}
        {activeUsers.map(
          (user) =>
            user.username !== currentUser?.username && (
              <div key={user.username} className="px-1 text-center">
                <Avatar className="!bg-primary-main">
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                {/* <Avatar
                  avatarUrl={user.avatarUrl}
                  username={user.username}
                  isOnline={true}
                /> */}
                <small className="block text-sm">{user.username}</small>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default ActiveUserList;
