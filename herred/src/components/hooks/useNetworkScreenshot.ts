import { useContext } from 'react';
import { EditorContext } from '@/app/page';
import { NetworkContext } from '../Context';
import { NetworkInfoResponse } from '../types';

export const useNetworkScreenshot = () => {
  const editor = useContext(EditorContext);
  const { networkInfo, selectedSuggestion } = useContext(NetworkContext);

  // Capturar screenshot de la red actual con nombres de nodos
  const captureCurrentNetwork = async (): Promise<string | null> => {
    if (!editor) {
      console.error('Editor no disponible');
      return null;
    }

    try {
      // Obtener todas las formas del editor
      const shapes = editor.getCurrentPageShapes();
      
      if (shapes.length === 0) {
        console.warn('No hay formas para capturar');
        return null;
      }

      // Obtener el SVG base
      const baseSvg = await editor.getSvg(shapes);
      
      if (!baseSvg) {
        console.error('No se pudo generar SVG');
        return null;
      }

      // Agregar los nombres de los nodos al SVG
      const enhancedSvg = addNodeNamesToSvg(baseSvg, shapes);
      
      // Convertir SVG a base64 para incluir en HTML
      const svgString = new XMLSerializer().serializeToString(enhancedSvg);
      const base64SVG = btoa(unescape(encodeURIComponent(svgString)));
      
      return `data:image/svg+xml;base64,${base64SVG}`;
    } catch (error) {
      console.error('Error capturando screenshot:', error);
      return null;
    }
  };

  // Función para agregar nombres de nodos al SVG
  const addNodeNamesToSvg = (svg: SVGSVGElement, shapes: any[]): SVGSVGElement => {
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    
    // Filtrar solo los nodos (shapes de tipo 'node')
    const nodeShapes = shapes.filter(shape => shape.type === 'node');
    
    nodeShapes.forEach(shape => {
      // Buscar el nodo correspondiente en networkInfo
      const nodeInfo = networkInfo.nodes.find(node => node.shapeId === shape.id);
      
      if (nodeInfo && nodeInfo.name) {
        // Obtener la posición del nodo
        const x = shape.x + shape.props.w / 2; // Centro del nodo
        const y = shape.y + shape.props.h + 20; // Debajo del nodo
        
        // Crear elemento de texto para el nombre
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x.toString());
        textElement.setAttribute('y', y.toString());
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('font-family', 'Arial, sans-serif');
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', '#333');
        textElement.setAttribute('font-weight', 'bold');
        textElement.textContent = nodeInfo.name;
        
        // Agregar fondo blanco para mejor legibilidad
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const textBBox = getTextBoundingBox(nodeInfo.name, 12);
        bgRect.setAttribute('x', (x - textBBox.width / 2 - 4).toString());
        bgRect.setAttribute('y', (y - textBBox.height + 2).toString());
        bgRect.setAttribute('width', (textBBox.width + 8).toString());
        bgRect.setAttribute('height', (textBBox.height + 4).toString());
        bgRect.setAttribute('fill', 'white');
        bgRect.setAttribute('fill-opacity', '0.8');
        bgRect.setAttribute('rx', '3');
        
        // Agregar al SVG
        clonedSvg.appendChild(bgRect);
        clonedSvg.appendChild(textElement);
      }
    });
    
    return clonedSvg;
  };

  // Función auxiliar para calcular el tamaño del texto
  const getTextBoundingBox = (text: string, fontSize: number) => {
    // Aproximación del tamaño del texto
    const avgCharWidth = fontSize * 0.6; // Aproximación para Arial
    const width = text.length * avgCharWidth;
    const height = fontSize;
    
    return { width, height };
  };

  // Método alternativo usando html2canvas para mejor calidad
  const captureCurrentNetworkWithCanvas = async (): Promise<string | null> => {
    try {
      // Buscar el contenedor del canvas de Tldraw
      const tldrawContainer = document.querySelector('.tl-container');
      
      if (!tldrawContainer) {
        console.error('No se encontró el contenedor de Tldraw');
        return captureCurrentNetwork(); // Fallback al método SVG
      }

      // Importar html2canvas dinámicamente
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(tldrawContainer as HTMLElement, {
        backgroundColor: 'white',
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error con html2canvas, usando método SVG:', error);
      return captureCurrentNetwork(); // Fallback al método SVG
    }
  };

  // Generar visualización de la red sugerida (sin cambios)
  const generateSuggestedNetworkVisualization = (
    suggestion: NetworkInfoResponse['result'][0]
  ): string => {
    const path = suggestion.path.path;
    const nodeRequirements = suggestion.nodeRequirements;
    
    // Crear un SVG simple que muestre la ruta sugerida
    const width = 800;
    const height = 400;
    const nodeRadius = 25;
    const spacing = (width - 100) / (path.length - 1);
    
    // Generar posiciones de nodos
    const nodePositions = path.map((_, index) => ({
      x: 50 + index * spacing,
      y: height / 2
    }));

    const getNodeColor = (nodeId: number) => {
      const req = nodeRequirements.find(r => r.id === nodeId);
      if (req?.dangerFlag) return '#dc2626'; // rojo
      if (req?.warningFlag) return '#f59e0b'; // amarillo
      return '#10b981'; // verde
    };

    const getConnectionColor = (connection: number) => {
      return connection === 2 ? '#3b82f6' : '#8b5cf6'; // azul para fibra, púrpura para microondas
    };

    const getConnectionStyle = (connection: number) => {
      return connection === 2 ? 'solid' : 'dashed';
    };

    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>
        
        <!-- Título -->
        <text x="${width/2}" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">
          Red Sugerida - Opción Seleccionada
        </text>
        
        <!-- Información de la ruta -->
        <text x="20" y="60" font-family="Arial" font-size="12" fill="#666">
          Capacidad máxima: ${suggestion.path.maxCapacity} | Saltos: ${suggestion.path.jumps} | 
          Fibra óptica: ${suggestion.path.opticFiber} | Microondas: ${suggestion.path.microwave}
        </text>
        
        <!-- Conexiones -->
        ${path.slice(0, -1).map((node, index) => {
          const nextNode = path[index + 1];
          const startPos = nodePositions[index];
          const endPos = nodePositions[index + 1];
          
          return `
            <line x1="${startPos.x}" y1="${startPos.y}" 
                  x2="${endPos.x}" y2="${endPos.y}" 
                  stroke="${getConnectionColor(nextNode.connection)}" 
                  stroke-width="3" 
                  stroke-dasharray="${getConnectionStyle(nextNode.connection) === 'dashed' ? '10,5' : 'none'}"
                  marker-end="url(#arrowhead)" />
            
            <!-- Etiqueta de capacidad -->
            <text x="${(startPos.x + endPos.x) / 2}" y="${(startPos.y + endPos.y) / 2 - 10}" 
                  text-anchor="middle" font-family="Arial" font-size="10" fill="#333">
              ${nextNode.capacity !== null ? `${nextNode.capacity}/${nextNode.maxCapacity}` : ''}
            </text>
          `;
        }).join('')}
        
        <!-- Nodos -->
        ${path.map((node, index) => {
          const pos = nodePositions[index];
          const isBottleneck = node.nodeId === suggestion.bottleneckNode;
          const nodeName = networkInfo.nodes.find(n => n.id === node.nodeId)?.name || `Nodo ${node.nodeId}`;
          
          return `
            <circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" 
                    fill="${getNodeColor(node.nodeId)}" 
                    stroke="${isBottleneck ? '#dc2626' : '#333'}" 
                    stroke-width="${isBottleneck ? '4' : '2'}" />
            
            <text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" 
                  font-family="Arial" font-size="12" font-weight="bold" fill="white">
              ${node.nodeId}
            </text>
            
            <!-- Nombre del nodo -->
            <rect x="${pos.x - nodeName.length * 3}" y="${pos.y + nodeRadius + 10}" 
                  width="${nodeName.length * 6}" height="16" 
                  fill="white" fill-opacity="0.8" rx="3" />
            <text x="${pos.x}" y="${pos.y + nodeRadius + 22}" text-anchor="middle" 
                  font-family="Arial" font-size="10" font-weight="bold" fill="#333">
              ${nodeName}
            </text>
            
            ${isBottleneck ? `
              <text x="${pos.x}" y="${pos.y + nodeRadius + 38}" text-anchor="middle" 
                    font-family="Arial" font-size="9" fill="#dc2626" font-weight="bold">
                (Cuello de botella)
              </text>
            ` : ''}
          `;
        }).join('')}
        
        <!-- Leyenda -->
        <g transform="translate(20, ${height - 100})">
          <text x="0" y="0" font-family="Arial" font-size="14" font-weight="bold">Leyenda:</text>
          
          <!-- Estados de nodos -->
          <circle cx="15" cy="20" r="8" fill="#10b981" />
          <text x="30" y="25" font-family="Arial" font-size="11">Seguro</text>
          
          <circle cx="80" cy="20" r="8" fill="#f59e0b" />
          <text x="95" y="25" font-family="Arial" font-size="11">Advertencia</text>
          
          <circle cx="160" cy="20" r="8" fill="#dc2626" />
          <text x="175" y="25" font-family="Arial" font-size="11">Peligro</text>
          
          <!-- Tipos de conexión -->
          <line x1="250" y1="20" x2="280" y2="20" stroke="#3b82f6" stroke-width="3" />
          <text x="285" y="25" font-family="Arial" font-size="11">Fibra óptica</text>
          
          <line x1="360" y1="20" x2="390" y2="20" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="5,3" />
          <text x="395" y="25" font-family="Arial" font-size="11">Microondas</text>
        </g>
      </svg>
    `;

    // Convertir a base64
    const base64SVG = btoa(unescape(encodeURIComponent(svgContent)));
    return `data:image/svg+xml;base64,${base64SVG}`;
  };

  return {
    captureCurrentNetwork: captureCurrentNetworkWithCanvas, // Usar el método con canvas por defecto
    generateSuggestedNetworkVisualization
  };
};