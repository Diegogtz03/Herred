import React from 'react';

export interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  classNameOverride?: string;
}

export function InputField({
  label,
  value,
  onChange,
  onBlur,
  onKeyDown,
  inputRef,
    classNameOverride,
}: InputFieldProps) {
  return (
    <>
    {label && (
      <label className= {classNameOverride?? "text-sm text-gray-500 block mb-1"}>
        {label}
      </label>
    )}
    <input
    ref={inputRef}
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
