import React, { useState, useRef, useEffect, useContext } from "react";

interface SuggestionProps {
    data: any;
    idx: number;
  }

  export default function SuggestionComponent({
    data,
    idx,
  }: SuggestionProps) {  
    return (
    <button 
    type="button" 
    className="mb-3 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-3 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        Opcion {idx + 1}
    </button>
  );
}
