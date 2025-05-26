import { PencilIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";

export default function SidebarNodeInfo() {
  const { selectedNode, updateNode } = useContext(NetworkContext);
  
  // Initialize name safely and update it via useEffect when selectedNode changes
  const [name, setName] = useState(selectedNode?.name || "");
  const [umbral, setUmbral] = useState(selectedNode?.umbral || 0);
  const [nodeType, setNodeType] = useState(selectedNode?.type || "central");

  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name || "");
      setUmbral(selectedNode.umbral || 0);
      setNodeType(selectedNode.type || "central");
    } else {
      // Reset fields if no node is selected
      setName("");
      setUmbral(0);
      setNodeType("central");
    }
  }, [selectedNode]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    if (selectedNode) {
      updateNode(selectedNode.shapeId, { // No need to spread selectedNode, updateNode handles partials
        name: name,
      });
    }
    setIsEditingName(false);
  };

  const handleUmbralChange = (newUmbral: number) => {
    setUmbral(newUmbral);
    if (selectedNode) {
      updateNode(selectedNode.shapeId, {
        umbral: newUmbral,
      });
    }
  }
  
  // Add similar handlers if nodeType needs to be editable from here
  // For now, assuming nodeType is primarily changed via CustomStylePanel for nodes

  if (!selectedNode) {
    return <div className="p-4">No node selected or node data is loading...</div>; // Or some loading/empty state
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-start items-center pb-3">
        <PencilIcon
          className="h-5 w-5 cursor-pointer hover:text-blue-500 mr-4"
          onClick={() => setIsEditingName((prev) => !prev)}
        />
        {isEditingName ? (
          <InputField
            inputRef={nameInputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameSave} // Save on blur
            onKeyDown={(e) => e.key === "Enter" && handleNameSave()} // Save on Enter
            classNameOverride="text-xl border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1 className="text-gray-950 text-2xl truncate" title={name}>{name || "Unnamed Node"}</h1>
        )}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Configuración</h2>
        </div>

        <InputField
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
        />
      </div>
    </div>
  );
}
