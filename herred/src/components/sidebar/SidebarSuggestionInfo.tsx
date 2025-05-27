import React, { useContext } from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { NetworkContext } from "../Context";
import SuggestionComponent from "./SuggestionComponent";

export default function SidebarSuggestionInfo() {
  const { algorithmResponse, selectedNode } = useContext(NetworkContext);

  return (
    <div className="flex flex-col n h-full pb-6">
      <div className="flex justify-start items-center pb-3">
        <RocketLaunchIcon className="flex-shrink-0 h-5 w-5 cursor-pointer hover:text-blue-500 mr-4" />
        <h1 className="text-gray-950 text-xl whitespace-normal break-words">
          Sugerencias para: {selectedNode?.name}
        </h1>
      </div>
      {algorithmResponse && algorithmResponse.result.length > 0 && (
        <div className="w-full overflow-y-auto flex flex-col space-y-2">
          {algorithmResponse.result.map((item, index) => (
            <SuggestionComponent data={item} key={index} idx={index} />
          ))}
        </div>
      )}
    </div>
  );
}
