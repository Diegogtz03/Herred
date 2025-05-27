import React, { useState, useRef, useEffect, useContext } from "react";
import { NetworkInfoResponse } from "../types";
import { NetworkContext } from "../Context";
import { NetworkInfoResponse } from "../types";

interface SuggestionProps {
  data: any;
  idx: number;
  isSelected: boolean;
}

interface SuggestionHeaderProps {
  value: string;
  iconPath: string;
  title: string;
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

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [expanded]);

  return (
    <div
      className={`items-center mb-3 w-full text-gray-900 ${
        isSelected ? "bg-blue-100" : "bg-white"
      } border border-gray-300 focus:outline-none hover:${
        isSelected ? "bg-blue-300" : "bg-gray-100"
      } focus:ring-4 focus:ring-gray-100 font-medium rounded-lg px-5 py-2 transition-all duration-300`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header: Opción + botón seleccionar */}
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-red-900">Opción {idx}</div>
        {!isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
          >
            Seleccionar
          </button>
        )}
      </div>

      {/* Valores principales + toggle expandir */}
      <button type="button" className="w-full text-left">
        <div className="flex justify-around items-center text-xl font-bold mb-2">
          <SuggestionComponentHeaderItem
            value={data.path.maxCapacity}
            iconPath="/icons/tools/connection.svg"
            title="Capacidad máxima"
          />
          <SuggestionComponentHeaderItem
            value={data.path.jumps}
            iconPath="/icons/tools/node.svg"
            title="Número de saltos"
          />
        </div>

        {/* Puntos animados */}
        <div
          className={`flex justify-center mb-1 transition-opacity duration-100 ${
            expanded ? "opacity-0 delay-0" : "opacity-100 delay-400"
          }`}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 mx-0.5 rounded-full bg-gray-400"
            />
          ))}
        </div>
      </button>

      {/* Contenido expandible */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight }}
      >
        <div className="text-gray-700 text-sm pb-1">
          <div className="flex gap-4 justify-center mb-2">
            <div className="flex items-center gap-2 border-2 border-solid px-3 py-1 rounded-md text-xs">
              Fibra óptica
            </div>
            <div className="flex items-center border-2 border-dashed px-3 py-1 rounded-md text-xs">
              Microondas
            </div>
          </div>
          <PathNodeList
            path={data.path.path}
            nodeRequirements={data.nodeRequirements}
            bottleneckNode={data.bottleneckNode}
          />
        </div>
      </div>
    </div>
  );
}

function SuggestionComponentHeaderItem({
  value,
  iconPath,
  title,
}: SuggestionHeaderProps) {
  return (
    <div className="flex items-center gap-2 relative">
      <div className="flex items-center gap-2 relative group">
        <div
          className="tlui-icon tlui-button__icon"
          style={{
            mask: `url("${iconPath}") center / 100% 100% no-repeat`,
            WebkitMask: `url("${iconPath}") center / 100% 100% no-repeat`,
          }}
        />
        <div className="text-gray-900">{value}</div>

        {/* Tooltip (solo se muestra si el cursor está sobre el ícono o valor) */}
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
          {title}
        </div>
      </div>
    </div>
  );
}
type Node = {
  nodeId: number;
  capacity: number | null;
  maxCapacity: number | null;
  connection: number;
};

type NodeRequirement = {
  id: number;
  dangerFlag: boolean;
  warningFlag: boolean;
};

interface PathListProps {
  path: Node[];
  nodeRequirements: NodeRequirement[];
  bottleneckNode: number;
}

export function PathNodeList({
  path,
  nodeRequirements,
  bottleneckNode,
}: PathListProps) {
  return (
    <div className="flex flex-col gap-2">
      {path.map((node) => {
        const nodeReq = nodeRequirements.find((n) => n.id === node.nodeId);
        const hasWarning = nodeReq?.warningFlag;
        const hasDanger = nodeReq?.dangerFlag;
        const borderStyle =
          node.connection === 1 ? "border-dashed" : "border-solid";
        const isBottleneck = node.nodeId == bottleneckNode;
        console.log("Node", node.nodeId, "bottleneck:", bottleneckNode);
        return (
          <div
            key={node.nodeId}
            className={`grid grid-cols-3 items-center px-4 py-2 rounded-md shadow-sm border-2 ${
              isBottleneck ? "bg-red-100" : ""
            } ${borderStyle} ${
              hasDanger
                ? "border-red-500 text-red-500"
                : hasWarning
                ? "border-yellow-500 text-yellow-500"
                : "border-green-500 text-green-500"
            }`}
          >
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 tlui-icon tlui-button__icon"
                style={{
                  mask: 'url("/icons/tools/node.svg") center / contain no-repeat',
                  WebkitMask:
                    'url("/icons/tools/node.svg") center / contain no-repeat',
                  backgroundColor: hasWarning ? "#991b1b" : "#166534", // rojo oscuro o verde oscuro
                }}
              />
              <span className="font-bold">{node.nodeId}</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 tlui-icon tlui-button__icon"
                style={{
                  mask: 'url("/icons/tools/connection.svg") center / contain no-repeat',
                  WebkitMask:
                    'url("/icons/tools/connection.svg") center / contain no-repeat',
                  backgroundColor: hasWarning ? "#991b1b" : "#166534", // rojo oscuro o verde oscuro
                }}
              />
              <span>
                {node.capacity ?? ""} / {node.maxCapacity ?? ""}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

//   const getConnectionTypeText = (connection: number) => {
//     switch (connection) {
//       case 2:
//         return "Fibra Óptica";
//       case 1:
//         return "Microondas";
//       default:
//         return "Origen";
//     }
//   };

//   // lo que dijo robegrill de las advertencias
//   const getConnectionWarnings = () => {
//     const warnings: Array<{
//       fromNode: number;
//       toNode: number;
//       warningType: "warning" | "danger";
//     }> = [];

//     const path = data.path.path;
//     const nodeRequirements = data.nodeRequirements;

//     for (let i = 0; i < path.length - 1; i++) {
//       const currentNode = path[i];
//       const nextNode = path[i + 1];

//       const currentNodeReq = nodeRequirements.find(
//         (req) => req.id === currentNode.nodeId
//       );
//       const nextNodeReq = nodeRequirements.find(
//         (req) => req.id === nextNode.nodeId
//       );

//       const hasWarning =
//         (currentNodeReq?.warningFlag || nextNodeReq?.warningFlag) &&
//         !(currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag);
//       const hasDanger = currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag;

//       if (hasWarning || hasDanger) {
//         warnings.push({
//           fromNode: currentNode.nodeId,
//           toNode: nextNode.nodeId,
//           warningType: hasDanger ? "danger" : "warning",
//         });
//       }
//     }

//     return warnings;
//   };

//   const connectionWarnings = getConnectionWarnings();

//   return (
//     <button
//       type="button"
//       onClick={handleSelect}
//       className={`mb-3 text-left w-full p-4 border rounded-lg transition-all ${
//         isSelected
//           ? "bg-blue-100 border-blue-500 text-blue-900"
//           : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
//       } focus:outline-none focus:ring-4 focus:ring-blue-100`}
//     >
//       <div className="font-semibold mb-2">Opción {idx + 1}</div>

//       <div className="text-sm space-y-1">
//         <div>
//           <strong>Capacidad máxima:</strong> {data.path.maxCapacity}
//         </div>
//         <div>
//           <strong>Saltos:</strong> {data.path.jumps}
//         </div>
//         <div>
//           <strong>Fibra óptica:</strong> {data.path.opticFiber} |{" "}
//           <strong>Microondas:</strong> {data.path.microwave}
//         </div>
//         <div>
//           <strong>Cuello de botella:</strong> Nodo {data.bottleneckNode}
//         </div>

//         <div className="mt-2">
//           <strong>Ruta:</strong>
//           <div className="text-xs mt-1">
//             {data.path.path.map((node, index) => (
//               <span key={index}>
//                 Nodo {node.nodeId}
//                 {node.connection > 0 &&
//                   ` (${getConnectionTypeText(node.connection)})`}
//                 {index < data.path.path.length - 1 && " → "}
//               </span>
//             ))}
//           </div>
//         </div>

//         {connectionWarnings.length > 0 && (
//           <div className="mt-2">
//             <strong>Advertencias de conexiones:</strong>
//             <div className="text-xs mt-1 space-y-1">
//               {connectionWarnings.map((warning, index) => (
//                 <div
//                   key={index}
//                   className={`px-2 py-1 rounded ${
//                     warning.warningType === "danger"
//                       ? "bg-red-100 text-red-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   Nodo {warning.fromNode} → Nodo {warning.toNode}:{" "}
//                   {warning.warningType === "danger" ? "PELIGRO" : "ADVERTENCIA"}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </button>
//   );
