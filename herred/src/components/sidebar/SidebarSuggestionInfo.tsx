import { PencilIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";

export default function SidebarSuggestionInfo() {
  const { selectedNode, updateNode } = useContext(NetworkContext);
  // const [name, setName] = useState(selectedNode!.name);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    console.log(selectedNode!.name);
    console.log(selectedNode!.shapeId);
    setIsEditing(false);
    // updateNode(selectedNode!.shapeId, {
    //   ...selectedNode!,
    //   // name: name,
    // });
  };

  return (
    <div className="flex flex-col justify-between h-full pb-6">
      <div className="flex justify-start items-center pb-3">
        <RocketLaunchIcon
          className=" flex-shrink-0  h-5 w-5 cursor-pointer hover:text-blue-500 mr-4"
          // onClick={() => setIsEditing((prev) => !prev)}
        />
        {/* {isEditing ? (
          <InputField
            inputRef={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            classNameOverride="text-xl border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : ( */}
          <h1 className="text-gray-950 text-2xl whitespace-normal break-words">
            Sugerencias para: {selectedNode?.name}
            </h1>
        {/* )} */}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-1">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Dummy</h2>
        </div>

        {/* <InputField
          value={String(selectedNode!.umbral)}
          onChange={(e) => {}}
          onBlur={() => {}}
          onKeyDown={() => {}}
          label="Umbral de detección"
        />

        <InputField
          value={selectedNode!.type}
          onChange={(e) => {}}
          onBlur={() => {}}
          onKeyDown={() => {}}
          label="Tipo"
        /> */}
      </div>
      <button
        type="button"
        className='
          mt-auto text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none
         focus:ring-purple-200 dark:focus:ring-purple-800 rounded-lg text-sm px-5 py-2.5 text-center mx-4 mb-2 transition-all duration-300 ease-in-out 
        shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
        onClick={() => {
          // Placeholder for generating suggestions
            console.log("Generar sugerencia clicked");
        }}
      >
        Generar sugerencia
      </button>
    </div>
  );
}
