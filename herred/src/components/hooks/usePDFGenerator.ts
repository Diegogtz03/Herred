import { useContext } from 'react';
import { NetworkContext } from '../Context';
import { PDFReportData, NetworkInfoResponse } from '../types';
import { useNetworkScreenshot } from './useNetworkScreenshot';

export const usePDFGenerator = () => {
  const { networkInfo, selectedNode, selectedSuggestion } = useContext(NetworkContext);
  const { captureCurrentNetwork, generateSuggestedNetworkVisualization } = useNetworkScreenshot();

  const generatePDFReport = async () => {
    if (!selectedNode || !selectedSuggestion) {
      console.error('No hay nodo o sugerencia seleccionada');
      return;
    }

    // Capturar screenshot de la red actual
    const currentNetworkImage = await captureCurrentNetwork();
    
    // Generar visualización de la red sugerida
    const suggestedNetworkImage = generateSuggestedNetworkVisualization(selectedSuggestion);

    const reportData: PDFReportData = {
      networkName: networkInfo.name,
      selectedNode,
      suggestion: selectedSuggestion,
      timestamp: new Date(),
    };

    // Crear contenido HTML para el PDF
    const htmlContent = generateHTMLReport(reportData, currentNetworkImage, suggestedNetworkImage);
    
    // Abrir ventana para imprimir/guardar como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que las imágenes se carguen antes de imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  };

  // Función para mapear advertencias de nodos a conexiones
  const getConnectionWarnings = (suggestion: NetworkInfoResponse['result'][0]) => {
    const warnings: Array<{
      fromNode: number;
      toNode: number;
      connectionType: string;
      warningType: 'warning' | 'danger';
      capacity?: number;
      maxCapacity?: number;
    }> = [];

    const path = suggestion.path.path;
    const nodeRequirements = suggestion.nodeRequirements;

    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];
      
      const currentNodeReq = nodeRequirements.find(req => req.id === currentNode.nodeId);
      const nextNodeReq = nodeRequirements.find(req => req.id === nextNode.nodeId);
      
      const hasWarning = (currentNodeReq?.warningFlag || nextNodeReq?.warningFlag) && 
                        !(currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag);
      const hasDanger = currentNodeReq?.dangerFlag || nextNodeReq?.dangerFlag;
      
      if (hasWarning || hasDanger) {
        const connectionType = nextNode.connection === 2 ? 'Fibra Óptica' : 
                              nextNode.connection === 1 ? 'Microondas' : 'Desconocido';
        
        warnings.push({
          fromNode: currentNode.nodeId,
          toNode: nextNode.nodeId,
          connectionType,
          warningType: hasDanger ? 'danger' : 'warning',
          capacity: nextNode.capacity,
          maxCapacity: nextNode.maxCapacity,
        });
      }
    }

    return warnings;
  };

  const generateHTMLReport = (
    data: PDFReportData, 
    currentNetworkImage: string | null, 
    suggestedNetworkImage: string
  ): string => {
    const { networkName, selectedNode, suggestion, timestamp } = data;
    const connectionWarnings = getConnectionWarnings(suggestion);
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Red - ${networkName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin: 20px 0; page-break-inside: avoid; }
            .network-images { margin: 20px 0; }
            .network-image { margin: 15px 0; text-align: center; }
            .network-image img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; }
            .network-image h4 { margin: 10px 0 5px 0; color: #333; }
            .path-item { margin: 5px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .connection-warning { margin: 5px 0; padding: 10px; border-radius: 5px; border-left: 4px solid; }
            .warning { background-color: #fff3cd; border-left-color: #ff6b35; color: #856404; }
            .danger { background-color: #f8d7da; border-left-color: #d32f2f; color: #721c24; }
            .safe { background-color: #d4edda; border-left-color: #4caf50; color: #155724; }
            .connection-arrow { font-weight: bold; color: #666; }
            .capacity-info { font-size: 0.9em; color: #666; margin-top: 5px; }
            .two-column { display: flex; gap: 20px; }
            .column { flex: 1; }
            @media print {
              .network-images { page-break-inside: avoid; }
              .two-column { display: block; }
              .column { margin-bottom: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Análisis de Red</h1>
            <h2>${networkName}</h2>
            <p>Generado el: ${timestamp.toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h3>Nodo Objetivo: ${selectedNode.name}</h3>
            <p><strong>ID:</strong> ${selectedNode.id}</p>
            <p><strong>Consumo:</strong> ${selectedNode.consumption}</p>
            <p><strong>Tipo:</strong> ${selectedNode.type}</p>
          </div>

          <div class="section network-images">
            <h3>Visualización de la Red</h3>
            <div class="two-column">
              ${currentNetworkImage ? `
                <div class="column">
                  <div class="network-image">
                    <h4>Red Actual</h4>
                    <img src="${currentNetworkImage}" alt="Red Actual" />
                  </div>
                </div>
              ` : ''}
              <div class="column">
                <div class="network-image">
                  <h4>Ruta Sugerida</h4>
                  <img src="${suggestedNetworkImage}" alt="Red Sugerida" />
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Resumen de la Ruta Sugerida</h3>
            <p><strong>Capacidad Máxima:</strong> ${suggestion.path.maxCapacity}</p>
            <p><strong>Número de Saltos:</strong> ${suggestion.path.jumps}</p>
            <p><strong>Conexiones Fibra Óptica:</strong> ${suggestion.path.opticFiber}</p>
            <p><strong>Conexiones Microondas:</strong> ${suggestion.path.microwave}</p>
            <p><strong>Nodo Cuello de Botella:</strong> ${suggestion.bottleneckNode}</p>
          </div>

          <div class="section">
            <h3>Detalle de la Ruta</h3>
            ${suggestion.path.path.map((node, index) => `
              <div class="path-item">
                <strong>Paso ${index + 1}:</strong> Nodo ${node.nodeId}
                ${node.capacity !== null ? `<br><span class="capacity-info">Capacidad: ${node.capacity}/${node.maxCapacity}</span>` : ''}
                ${node.connection === 2 ? '<br>Tipo: Fibra Óptica' : node.connection === 1 ? '<br>Tipo: Microondas' : '<br>Punto de origen'}
                ${index < suggestion.path.path.length - 1 ? '<span class="connection-arrow"> → </span>' : ''}
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h3>Estado de las Conexiones</h3>
            ${connectionWarnings.length > 0 ? 
              connectionWarnings.map(warning => `
                <div class="connection-warning ${warning.warningType}">
                  <strong>Conexión: Nodo ${warning.fromNode} → Nodo ${warning.toNode}</strong>
                  <br>Tipo: ${warning.connectionType}
                  <br>Estado: ${warning.warningType === 'danger' ? 'PELIGRO - Capacidad crítica' : 'ADVERTENCIA - Capacidad limitada'}
                  ${warning.capacity && warning.maxCapacity ? 
                    `<div class="capacity-info">Capacidad utilizada: ${warning.capacity}/${warning.maxCapacity}</div>` : ''}
                </div>
              `).join('') 
              : 
              '<div class="connection-warning safe"><strong>✓ Todas las conexiones están en estado seguro</strong></div>'
            }
          </div>

          <div class="section">
            <h3>Recomendaciones</h3>
            ${connectionWarnings.length > 0 ? `
              <ul>
                ${connectionWarnings.map(warning => `
                  <li>
                    <strong>Conexión Nodo ${warning.fromNode} → Nodo ${warning.toNode}:</strong>
                    ${warning.warningType === 'danger' ? 
                      'Se recomienda aumentar la capacidad o buscar rutas alternativas inmediatamente.' :
                      'Monitorear el uso y considerar aumentar la capacidad si es necesario.'
                    }
                  </li>
                `).join('')}
              </ul>
            ` : `
              <p>La ruta propuesta no presenta problemas de capacidad significativos.</p>
            `}
          </div>
        </body>
      </html>
    `;
  };

  return { generatePDFReport };
};