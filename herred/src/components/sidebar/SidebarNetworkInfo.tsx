import { PencilIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";

export default function SidebarNetworkInfo() {
  const {networkInfo, updateNetworkInfo } = useContext(NetworkContext);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(networkInfo.name);
  const [umbral, setUmbral] = useState(networkInfo.umbral);
  const [numberOfNodes, setNumberOfNodes] = useState(networkInfo.numberOfNodes);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    console.log(name);
    console.log("GUARDANDO");
    setIsEditing(false);
    updateNetworkInfo({
      ...networkInfo,
      name: name,
      umbral: umbral,
    });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-start items-center pb-3">
          <PencilIcon
            className="h-5 w-5 cursor-pointer hover:text-blue-500 mr-4"
            onClick={() => setIsEditing((prev) => !prev)}
          />
          {isEditing ? (
            <InputField
              inputRef={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              classNameOverride="text-xl border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-gray-950 text-2xl">{networkInfo.name}</h1>
          )}
        </div>

        <div className="w-full max-w-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
            <h2 className="font-medium text-lg">Configuración</h2>
          </div>

          <InputField
            value={String(umbral)}
            onChange={(e) => setUmbral(Number(e.target.value))}
            onBlur={() => {}}
            onKeyDown={handleSave}
            label="Umbral de detección"
          />

          <InputField
            value={String(numberOfNodes)}
            onChange={(e) => setNumberOfNodes(Number(e.target.value))}
            onBlur={() => {}}
            onKeyDown={() => {}}
            label="Número de nodos"
          />
        </div>
      </div>

    </div>
  );
}
