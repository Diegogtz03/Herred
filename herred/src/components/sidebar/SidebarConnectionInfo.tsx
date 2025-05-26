import { PencilIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";
import { ConnectionType } from "../types";

export default function SidebarConnectionInfo() {
  const { selectedConnection, updateConnection } =
    useContext(NetworkContext);

  const [isEditing, setIsEditing] = useState(false);
  const [connectionType, setConnectionType] = useState<'fiber' | 'microwave'>('fiber');
  const [capacity, setCapacity] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedConnection) {
      setConnectionType(selectedConnection.connectionType || 'fiber');
      setCapacity(selectedConnection.capacity || 0);
    }
  }, [selectedConnection]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (selectedConnection) {
      const updatedConn: ConnectionType = {
        ...selectedConnection,
        connectionType,
        capacity,
        microwave: connectionType === 'microwave',
        opticFiber: connectionType === 'fiber',
      };
      updateConnection(selectedConnection.shapeId, updatedConn);
    }
    setIsEditing(false);
  };

  const handleConnectionTypeChange = (newType: 'fiber' | 'microwave') => {
    setConnectionType(newType);
    
    if (selectedConnection) {
      const updatedConnection: ConnectionType = {
        ...selectedConnection,
        connectionType: newType,
        microwave: newType === 'microwave',
        opticFiber: newType === 'fiber',
      };
      
      updateConnection(selectedConnection.shapeId, updatedConnection);
    }
  };

  const handleCapacityChange = (newCapacity: number) => {
    setCapacity(newCapacity);
    
    if (selectedConnection) {
      const updatedConnection: ConnectionType = {
        ...selectedConnection,
        capacity: newCapacity,
      };
      
      updateConnection(selectedConnection.shapeId, updatedConnection);
    }
  };

  if (!selectedConnection) {
    return (
      <div className="p-4 text-gray-500">
        Selecciona una conexión para ver sus propiedades
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-start items-center pb-3">
        <PencilIcon
          className="h-5 w-5 cursor-pointer hover:text-blue-500 mr-4"
          onClick={() => setIsEditing((prev) => !prev)}
        />
        <h1 className="text-gray-950 text-2xl">Conexión</h1>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Configuración</h2>
        </div>

        {/* Dropdown para tipo de conexión */}
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">
            Tipo de conexión
          </label>
          <select
            value={connectionType}
            onChange={(e) => handleConnectionTypeChange(e.target.value as 'fiber' | 'microwave')}
            className="w-full border border-gray-300 rounded-xl px-3 py-1 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fibra">Fibra Óptica</option>
            <option value="microwave">Microwave</option>
          </select>
        </div>

        {/* Input para capacidad */}
        <div className="mb-4">
          <InputField
            value={String(capacity)}
            onChange={(e) => handleCapacityChange(Number(e.target.value) || 0)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            label="Capacidad"
          />
        </div>

        {/* Información visual del tipo de conexión
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h3>
          <div className="flex items-center space-x-2">
            <div 
              className={`w-8 h-1 ${
                connectionType === 'fiber' 
                  ? 'bg-yellow-500' 
                  : 'bg-black border-dashed'
              }`}
              style={{
                borderStyle: connectionType === 'microwave' ? 'dashed' : 'solid',
                borderWidth: connectionType === 'microwave' ? '1px' : '0',
                borderColor: connectionType === 'microwave' ? 'black' : 'transparent',
                height: connectionType === 'microwave' ? '0' : '4px',
                borderTopWidth: connectionType === 'microwave' ? '2px' : '0'
              }}
            />
            <span className="text-sm text-gray-600">
              {connectionType === 'fiber' ? 'Línea amarilla sólida' : 'Línea negra discontinua'}
            </span>
          </div>
        </div> */}

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Origen:</strong> {selectedConnection.source}</p>
          <p><strong>Destino:</strong> {selectedConnection.target}</p>
          <p><strong>ID:</strong> {selectedConnection.shapeId}</p>
        </div>
      </div>
    </div>
  );
}
