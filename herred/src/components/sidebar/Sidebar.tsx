import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';


export function InputField({
  value,
  onChange,
  onBlur,
  onKeyDown,
  label,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  label:string;
}) {
  return (
    <>
    <label className="text-sm text-gray-500 block mb-1">{label}</label>
    <input
    type="text"
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    className="w-full border border-gray-300 rounded-xl px-3 py-1 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    </>
  );
}

export default function Sidebar() {

  //TODO: Cambiar los hooks de useState cuando se implemente el 
  // contexto global que va a llevar el estado de la aplicación
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("Red de San Luis");
  const inputRef = useRef<HTMLInputElement>(null);
  const [umbral, setUmbral] = useState("80%");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className=' text-gray-500 mt-3 truncate p-4'>
      <div className='flex justify-start items-center pb-3'>
        <PencilIcon
          className="h-5 w-5 cursor-pointer hover:text-blue-500 mr-4 "
          onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            className="text-xl border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1 className=' text-gray-950 text-2xl '>{value}</h1>
        )}
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-1">
          <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
          <h2 className="font-medium text-lg">Configuración</h2>
        </div>
          <InputField 
            value={umbral} 
            onChange={(e) => setUmbral(e.target.value)} 
            onBlur={() => {}} onKeyDown={() => {}} 
            label="Umbral de detección" 
          />
      </div>
    </div>
  );
}



