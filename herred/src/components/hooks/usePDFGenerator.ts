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
          * { box-sizing: border-box; }
          
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.4; 
            font-size: 14px;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
            margin-bottom: 25px;
            page-break-after: avoid;
          }
          
          .section { 
            margin: 15px 0; 
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          
          .section h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            page-break-after: avoid;
            font-size: 16px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          
          .network-images { 
            margin: 20px 0; 
            page-break-inside: avoid;
            min-height: 300px;
          }
          
          .network-image { 
            margin: 10px 0; 
            text-align: center; 
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .network-image h4 { 
            margin: 5px 0 10px 0; 
            color: #333; 
            font-size: 14px;
            font-weight: bold;
            page-break-after: avoid;
          }
          
          .network-image img { 
            max-width: 100%; 
            height: auto; 
            max-height: 350px;
            border: 1px solid #ddd; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: block;
            margin: 0 auto;
          }
          
          .network-image p {
            margin: 5px 0 0 0;
            font-size: 11px;
            color: #666;
          }
          
          .path-item { 
            margin: 3px 0; 
            padding: 8px; 
            background: #f5f5f5; 
            border-radius: 4px;
            page-break-inside: avoid;
            font-size: 13px;
          }
          
          .connection-warning { 
            margin: 3px 0; 
            padding: 8px; 
            border-radius: 4px; 
            border-left: 4px solid;
            page-break-inside: avoid;
            font-size: 13px;
          }
          
          .warning { 
            background-color: #fff3cd; 
            border-left-color: #ff6b35; 
            color: #856404; 
          }
          
          .danger { 
            background-color: #f8d7da; 
            border-left-color: #d32f2f; 
            color: #721c24; 
          }
          
          .safe { 
            background-color: #d4edda; 
            border-left-color: #4caf50; 
            color: #155724; 
          }
          
          .connection-arrow { 
            font-weight: bold; 
            color: #666; 
          }
          
          .capacity-info { 
            font-size: 0.85em; 
            color: #666; 
            margin-top: 3px; 
          }
          
          .two-column { 
            display: flex; 
            gap: 15px; 
            align-items: flex-start;
            page-break-inside: avoid;
          }
          
          .column { 
            flex: 1; 
            min-width: 0;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 10px 0;
            page-break-inside: avoid;
          }
          
          .summary-item {
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #007bff;
          }
          
          .summary-item strong {
            display: block;
            color: #333;
            font-size: 12px;
          }
          
          .summary-item span {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
          }
          
          .route-path {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            page-break-inside: avoid;
          }
          
          .route-step {
            display: inline-block;
            margin: 2px;
            padding: 4px 8px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 15px;
            font-size: 12px;
          }
          
          .route-arrow {
            color: #666;
            margin: 0 5px;
            font-weight: bold;
          }
          
          /* Reglas específicas para impresión */
          @media print {
            body { 
              margin: 0; 
              padding: 15px;
              font-size: 12px;
            }
            
            .section { 
              margin: 10px 0;
            }
            
            .network-images { 
              page-break-inside: avoid;
              page-break-before: auto;
              page-break-after: avoid;
            }
            
            .two-column { 
              display: block; 
            }
            
            .column { 
              margin-bottom: 15px; 
            }
            
            .network-image { 
              page-break-inside: avoid;
              page-break-before: avoid;
            }
            
            .network-image h4 {
              page-break-after: avoid;
              margin-bottom: 5px;
            }
            
            .network-image img { 
              max-height: 300px;
              page-break-inside: avoid;
            }
            
            .summary-grid {
              display: block;
            }
            
            .summary-item {
              margin-bottom: 5px;
            }
            
            /* Evitar huérfanos y viudas */
            h1, h2, h3, h4 {
              page-break-after: avoid;
              orphans: 3;
              widows: 3;
            }
            
            p, div {
              orphans: 2;
              widows: 2;
            }
            
            /* Forzar contenido junto */
            .keep-together {
              page-break-inside: avoid;
            }
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="header keep-together">
          <h1>Reporte de Análisis de Red</h1>
          <h2>${networkName}</h2>
          <p>Generado el: ${timestamp.toLocaleString()}</p>
        </div>
        
        <div class="section keep-together">
          <h3>📍 Información del Nodo Objetivo</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Nombre</strong>
              <span>${selectedNode.name}</span>
            </div>
            <div class="summary-item">
              <strong>ID</strong>
              <span>${selectedNode.id}</span>
            </div>
            <div class="summary-item">
              <strong>Consumo</strong>
              <span>${selectedNode.consumption}</span>
            </div>
            <div class="summary-item">
              <strong>Tipo</strong>
              <span>${selectedNode.type}</span>
            </div>
          </div>
        </div>

        <div class="section network-images keep-together">
          <h3>🎯 Visualización de la Red</h3>
          <div class="two-column">
            ${currentNetworkImage ? `
              <div class="column">
                <div class="network-image keep-together">
                  <h4>Red Actual (Diseñada por el Usuario)</h4>
                  <img src="${currentNetworkImage}" alt="Red Actual" />
                  <p>Vista actual de la red con nombres de nodos</p>
                </div>
              </div>
            ` : ''}
            <div class="column">
              <div class="network-image keep-together">
                <h4>Ruta Sugerida por el Algoritmo</h4>
                <img src="${suggestedNetworkImage}" alt="Red Sugerida" />
                <p>Ruta óptima calculada con análisis de capacidad</p>
              </div>
            </div>
          </div>
        </div>

        <div class="section keep-together">
          <h3>📊 Resumen de la Ruta Sugerida</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Capacidad Máxima</strong>
              <span>${suggestion.path.maxCapacity}</span>
            </div>
            <div class="summary-item">
              <strong>Número de Saltos</strong>
              <span>${suggestion.path.jumps}</span>
            </div>
            <div class="summary-item">
              <strong>Conexiones Fibra Óptica</strong>
              <span>${suggestion.path.opticFiber}</span>
            </div>
            <div class="summary-item">
              <strong>Conexiones Microondas</strong>
              <span>${suggestion.path.microwave}</span>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <strong>Nodo Cuello de Botella:</strong> <span style="color: #dc2626; font-weight: bold;">Nodo ${suggestion.bottleneckNode}</span>
          </div>
        </div>

        <div class="section">
          <h3>🛤️ Detalle de la Ruta</h3>
          <div class="route-path">
            ${suggestion.path.path.map((node, index) => `
              <span class="route-step">
                Nodo ${node.nodeId}
                ${node.capacity !== null ? `<br><small>${node.capacity}/${node.maxCapacity}</small>` : ''}
              </span>
              ${index < suggestion.path.path.length - 1 ? '<span class="route-arrow">→</span>' : ''}
            `).join('')}
          </div>
          
          <div style="margin-top: 15px;">
            ${suggestion.path.path.map((node, index) => `
              <div class="path-item">
                <strong>Paso ${index + 1}:</strong> Nodo ${node.nodeId}
                ${node.capacity !== null ? `<div class="capacity-info">Capacidad: ${node.capacity}/${node.maxCapacity}</div>` : ''}
                ${node.connection === 2 ? '<div style="color: #3b82f6;">📡 Fibra Óptica</div>' : 
                  node.connection === 1 ? '<div style="color: #8b5cf6;">📶 Microondas</div>' : 
                  '<div style="color: #666;">🏠 Punto de origen</div>'}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <h3>⚠️ Estado de las Conexiones</h3>
          ${connectionWarnings.length > 0 ? 
            connectionWarnings.map(warning => `
              <div class="connection-warning ${warning.warningType}">
                <strong>Conexión: Nodo ${warning.fromNode} → Nodo ${warning.toNode}</strong>
                <br>Tipo: ${warning.connectionType}
                <br>Estado: ${warning.warningType === 'danger' ? '🚨 PELIGRO - Capacidad crítica' : '⚠️ ADVERTENCIA - Capacidad limitada'}
                ${warning.capacity && warning.maxCapacity ? 
                  `<div class="capacity-info">Capacidad utilizada: ${warning.capacity}/${warning.maxCapacity}</div>` : ''}
              </div>
            `).join('') 
            : 
            '<div class="connection-warning safe"><strong>✅ Todas las conexiones están en estado seguro</strong></div>'
          }
        </div>

        <div class="section">
          <h3>💡 Recomendaciones</h3>
          ${connectionWarnings.length > 0 ? `
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${connectionWarnings.map(warning => `
                <li style="margin: 8px 0; page-break-inside: avoid;">
                  <strong>Conexión Nodo ${warning.fromNode} → Nodo ${warning.toNode}:</strong>
                  <br>
                  ${warning.warningType === 'danger' ? 
                    '🚨 Se recomienda aumentar la capacidad o buscar rutas alternativas inmediatamente.' :
                    '⚠️ Monitorear el uso y considerar aumentar la capacidad si es necesario.'
                  }
                </li>
              `).join('')}
            </ul>
          ` : `
            <div class="connection-warning safe">
              <strong>✅ La ruta propuesta no presenta problemas de capacidad significativos.</strong>
              <br>Se puede proceder con la implementación según lo planificado.
            </div>
          `}
        </div>
      </body>
    </html>
  `;
  };

  return { generatePDFReport };
};