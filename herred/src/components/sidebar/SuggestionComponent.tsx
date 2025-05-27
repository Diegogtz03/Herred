import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";
import { NetworkInfoResponse } from "../types";

interface SuggestionProps {
    data: NetworkInfoResponse['result'][0];
    idx: number;
    isSelected: boolean;
  }

  export default function SuggestionComponent({
    data,
    idx,
    isSelected,
  }: SuggestionProps) {  
    const { setSelectedSuggestion } = useContext(NetworkContext);

    const handleSelect = () => {
      setSelectedSuggestion(data);
    };

    const getConnectionTypeText = (connection: number) => {
      switch (connection) {
        case 2: return "Fibra Óptica";
        case 1: return "Microondas";
        default: return "Origen"
      }
    };

    // lo que dijo robegrill de las advertencias
    const getConnectionWarnings = () => {
      const warnings: Array<{
        fromNode: number;
        toNode: number;
        warningType: 'warning' | 'danger';
      }> = [];
  
      const path = data.path.path;
      const nodeRequirements = data.nodeRequirements;
  
      for (let i = 0; i < path.length - 1; i++) {
        const currentNode = path[i];
        const nextNode = path[i + 1];
        
        const currentNodeReq = nodeRequirements.find(req => req.id === currentNode.nodeId);
        const nextNodeReq = nodeRequirements.find(req => req.id === nextNode.nodeId);
        
        const hasWarning = (currentNodeReq?.warningFlag || nextNodeReq?.warningFlag) && 
                          !(currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag);
        const hasDanger = currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag;
        
        if (hasWarning || hasDanger) {
          warnings.push({
            fromNode: currentNode.nodeId,
            toNode: nextNode.nodeId,
            warningType: hasDanger ? 'danger' : 'warning',
          });
        }
      }
  
      return warnings;
    };

    const connectionWarnings = getConnectionWarnings();

    return (
      <button 
        type="button" 
        onClick={handleSelect}
        className={`mb-3 text-left w-full p-4 border rounded-lg transition-all ${
          isSelected 
            ? 'bg-blue-100 border-blue-500 text-blue-900' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
        } focus:outline-none focus:ring-4 focus:ring-blue-100`}
      >
        <div className="font-semibold mb-2">Opción {idx + 1}</div>
        
        <div className="text-sm space-y-1">
          <div><strong>Capacidad máxima:</strong> {data.path.maxCapacity}</div>
          <div><strong>Saltos:</strong> {data.path.jumps}</div>
          <div><strong>Fibra óptica:</strong> {data.path.opticFiber} | <strong>Microondas:</strong> {data.path.microwave}</div>
          <div><strong>Cuello de botella:</strong> Nodo {data.bottleneckNode}</div>
          
          <div className="mt-2">
            <strong>Ruta:</strong>
            <div className="text-xs mt-1">
              {data.path.path.map((node, index) => (
                <span key={index}>
                  Nodo {node.nodeId}
                  {node.connection > 0 && ` (${getConnectionTypeText(node.connection)})`}
                  {index < data.path.path.length - 1 && " → "}
                </span>
              ))}
            </div>
          </div>
  
          {connectionWarnings.length > 0 && (
            <div className="mt-2">
              <strong>Advertencias de conexiones:</strong>
              <div className="text-xs mt-1 space-y-1">
                {connectionWarnings.map((warning, index) => (
                  <div 
                    key={index}
                    className={`px-2 py-1 rounded ${
                      warning.warningType === 'danger' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    Nodo {warning.fromNode} → Nodo {warning.toNode}: {
                      warning.warningType === 'danger' ? 'PELIGRO' : 'ADVERTENCIA'
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </button>
    );
}
