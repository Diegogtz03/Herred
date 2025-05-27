import React, { useContext, useState } from "react";
import { RocketLaunchIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { NetworkContext } from "../Context";
import SuggestionComponent from "./SuggestionComponent";
import { usePDFGenerator } from "../hooks/usePDFGenerator";
import { dummyResponse } from "../types";


  export default function SidebarSuggestionInfo() {
    const { setAlgorithmResponse, algorithmResponse, selectedNode, selectedSuggestion } = useContext(NetworkContext);

    const { generatePDFReport } = usePDFGenerator();
    const [ isGeneratingPDF, setIsGeneratingPDF ] = useState(false);

    setAlgorithmResponse(dummyResponse);  

    const handleGeneratePDF = async () => {
      setIsGeneratingPDF(true);
      try {
        await generatePDFReport();
      } catch (error) {
        console.error("Error generando PDF:", error);
      } finally {
        setIsGeneratingPDF(false);
      }
    }
    return (
    <div className="flex flex-col h-full pb-6">
      <div className="flex justify-start items-center pb-3">
        <RocketLaunchIcon
          className="flex-shrink-0 h-5 w-5 cursor-pointer hover:text-blue-500 mr-4"
        />
        <h1 className="text-gray-950 text-xl whitespace-normal break-words">
          Sugerencias para: {selectedNode?.name}
        </h1>
      </div>
      
      {algorithmResponse && algorithmResponse.result.length > 0 && (
        <div className="w-full overflow-y-auto flex flex-col space-y-2 flex-1">
          {algorithmResponse.result.map((item, index) => (
            <SuggestionComponent 
              data={item} 
              key={index} 
              idx={index}
              isSelected={selectedSuggestion === item}
            />
          ))}
        </div>
      )}

      {selectedSuggestion && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className={`w-full text-white font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <DocumentArrowDownIcon className="h-5 w-5 inline-block mr-2" />
            {isGeneratingPDF ? 'Generando PDF...' : 'Generar reporte PDF'}
          </button>
        </div>
      )}
    </div>
  );
  }
