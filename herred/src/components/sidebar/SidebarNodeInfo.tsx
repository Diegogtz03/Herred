import { BoltIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";
import { NetworkInfoRequest } from "../types";

export default function SidebarNodeInfo() {
  const {
    selectedNode,
    updateNode,
    setSidePanelSelection,
    formatNetworkInfo,
    setAlgorithmResponse,
  } = useContext(NetworkContext);

  // Initialize name safely and update it via useEffect when selectedNode changes
  const [name, setName] = useState(selectedNode?.name || "");
  const [umbral, setUmbral] = useState(selectedNode?.umbral || 0);
  const [goal, setGoal] = useState(selectedNode?.umbral || 0);
  const [nodeType, setNodeType] = useState(selectedNode?.type || "central");
  const [consumption, setConsumption] = useState(
    selectedNode?.consumption || 0
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.name || "");
      setUmbral(selectedNode.umbral || 0);
      setConsumption(selectedNode.consumption || 0);
      setGoal(selectedNode.goal || 0);
      setNodeType(selectedNode.type || "central");
    } else {
      // Reset fields if no node is selected
      setName("");
      setUmbral(0);
      setGoal(0);
      setConsumption(0);
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
      updateNode(selectedNode.shapeId, {
        // No need to spread selectedNode, updateNode handles partials
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
  };

  const handleConsumptionChange = (newConsumption: number) => {
    setConsumption(newConsumption);
    if (selectedNode) {
      updateNode(selectedNode.shapeId, {
        ...selectedNode,
        consumption: newConsumption,
      });
    }
  };

  const handleGoalChange = (newGoal: number) => {
    setGoal(newGoal);
    if (selectedNode) {
      updateNode(selectedNode.shapeId, {
        ...selectedNode,
        goal: newGoal,
      });
    }
  };

  // Add similar handlers if nodeType needs to be editable from here
  // For now, assuming nodeType is primarily changed via CustomStylePanel for nodes

  if (!selectedNode) {
    return (
      <div className="p-4">No node selected or node data is loading...</div>
    ); // Or some loading/empty state
  }

  return (
    <div className="flex flex-col justify-between h-full pb-6">
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
          <h1 className="text-gray-950 text-2xl truncate" title={name}>
            {name || "Unnamed Node"}
          </h1>
        )}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Configuración</h2>
        </div>

        <InputField
          label="Consumo"
          value={String(consumption)}
          onChange={(e) => handleConsumptionChange(Number(e.target.value))}
          onBlur={() => {
            if (selectedNode) {
              updateNode(selectedNode.shapeId, {
                ...selectedNode,
                consumption,
              });
            }
          }}
        />

        <InputField
          label="Consumo Meta"
          value={String(goal)}
          onChange={(e) => handleGoalChange(Number(e.target.value))}
          onBlur={() => {
            if (selectedNode) {
              updateNode(selectedNode.shapeId, {
                ...selectedNode,
                goal,
              });
            }
          }}
        />
      </div>
      <button
        type="button"
        className="
          mt-auto text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none
         focus:ring-purple-200 dark:focus:ring-purple-800 rounded-lg text-sm px-5 py-2.5 text-center mx-4 mb-2 transition-all duration-300 ease-in-out 
        shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
        onClick={() => {
          const request: NetworkInfoRequest = formatNetworkInfo();

          console.log("Request", request);
          // Placeholder for generating suggestions
          setSidePanelSelection("suggestion", selectedNode?.shapeId);
          console.log("Generar sugerencia clicked");
        }}
      >
        Generar sugerencia
        <BoltIcon className="h-5 w-5 inline-block ml-1" />
      </button>
    </div>
  );
}
