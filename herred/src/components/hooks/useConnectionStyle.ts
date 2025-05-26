import { useContext, useEffect } from 'react';
import { useEditor, TLShapeId } from 'tldraw';
import { NetworkContext } from '../Context';

export function useConnectionStyle() {
  const editor = useEditor();
  const { networkInfo } = useContext(NetworkContext);

  useEffect(() => {
    // Actualizar estilos de todas las conexiones cuando cambien
    networkInfo.connections.forEach(connection => {
      const shape = editor.getShape(connection.shapeId as TLShapeId);
      if (shape && shape.type === 'arrow') {
        const newProps = {
          ...shape.props,
          dash: connection.connectionType === 'microwave' ? 'dashed' : 'solid',
          color: connection.connectionType === 'fiber' ? 'yellow' : 'black',
        };

        editor.updateShape({
          id: connection.shapeId as TLShapeId,
          type: 'arrow',
          props: newProps,
        });
      }
    });
  }, [networkInfo.connections, editor]);

  return null;
} 