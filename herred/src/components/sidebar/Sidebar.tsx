import React, { useState, useRef, useEffect, useContext } from "react";
import SidebarNetworkInfo from "./SidebarNetworkInfo";
import { NetworkContext } from "../Context";
import SidebarNodeInfo from "./SidebarNodeInfo";
import SidebarConnectionInfo from "./SidebarConnectionInfo";
import SidebarSuggestionInfo from "./SidebarSuggestionInfo";

export default function Sidebar() {
  const { sidePanelType } = useContext(NetworkContext);

  return (
    <div className=" text-gray-500 truncate p-4 h-full">
      {sidePanelType == "node" ? (
        <SidebarNodeInfo />
      ) : sidePanelType == "connection" ? (
        <SidebarConnectionInfo />
      ) : sidePanelType == "suggestion" ? (
        <SidebarSuggestionInfo />
      ) : (
        <SidebarNetworkInfo />
      )}
    </div>
  );
}
