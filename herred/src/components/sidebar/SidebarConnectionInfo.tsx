import { PencilIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { InputField } from "../TextInput";
import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkContext } from "../Context";
import { TLArrowShape } from "tldraw";
import { myConnectionStyle } from "../tools/CustomStylePanel";
import { EditorContext } from "../../app/page";

export default function SidebarConnectionInfo() {
  const editor = useContext(EditorContext);
  const { selectedConnection, updateConnection } =
    useContext(NetworkContext);

  const [name, setName] = useState(selectedConnection?.name || "Connection"); 
  const [capacity, setCapacity] = useState(selectedConnection?.capacity || 0);
  const [connectionType, setConnectionType] = useState<'fiber' | 'microwave'>(
    selectedConnection?.microwave ? 'microwave' : 'fiber'
  );

  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedConnection) {
      setName(selectedConnection.name || `Connection ${selectedConnection.id}`);
      setCapacity(selectedConnection.capacity || 0);
      setConnectionType(selectedConnection.microwave ? 'microwave' : 'fiber');
    } else {
      setName("Connection");
      setCapacity(0);
      setConnectionType('fiber');
    }
  }, [selectedConnection]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    if (selectedConnection) {
      updateConnection(selectedConnection.shapeId, {
        ...selectedConnection,
        name: name,
      });
    }
    setIsEditingName(false);
  };

  const handleCapacityChange = (newCapacity: number) => {
    setCapacity(newCapacity);
    if (selectedConnection) {
      updateConnection(selectedConnection.shapeId, {
        ...selectedConnection,
        capacity: newCapacity,
      });
    }
  };

  const handleConnectionTypeChange = (newType: 'fiber' | 'microwave') => {
    setConnectionType(newType);
    if (selectedConnection && editor) {
      const isMicrowave = newType === 'microwave';
      updateConnection(selectedConnection.shapeId, {
        ...selectedConnection,
        microwave: isMicrowave,
        opticFiber: !isMicrowave,
        name: selectedConnection.name,
      });

      editor.markHistoryStoppingPoint();
      editor.setStyleForSelectedShapes(myConnectionStyle, newType);
      
      const newColor = isMicrowave ? 'black' : 'yellow';
      const newDash: TLArrowShape['props']['dash'] = isMicrowave ? 'dashed' : 'draw';

      editor.updateShape<TLArrowShape>({
        id: selectedConnection.shapeId as TLArrowShape['id'],
        type: 'arrow',
        props: {
          color: newColor,
          dash: newDash,
        }
      });
    } else if (!editor) {
        console.warn("Editor instance not available in SidebarConnectionInfo");
    }
  };

  if (!selectedConnection) return <div className="p-4">No connection selected</div>;

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
            onBlur={handleNameSave}
            onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
            classNameOverride="text-xl border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1 className="text-gray-950 text-2xl truncate" title={name}>{name}</h1>
        )}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Configuración</h2>
        </div>

        <div>
          <label htmlFor="connectionType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Conexión
          </label>
          <select
            id="connectionType"
            name="connectionType"
            value={connectionType}
            onChange={(e) => handleConnectionTypeChange(e.target.value as 'fiber' | 'microwave')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="fiber">Fibra Óptica</option>
            <option value="microwave">Microondas</option>
          </select>
        </div>

        <InputField
          label="Capacidad"
          value={String(capacity)}
          onChange={(e) => handleCapacityChange(Number(e.target.value))}
          onBlur={() => { 
            if (selectedConnection) {
              updateConnection(selectedConnection.shapeId, { ...selectedConnection, capacity });
            }
          }}
        />
      </div>
    </div>
  );
}
