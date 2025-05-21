import {  StateNode, TLArrowShape } from "tldraw"

export class DeleteTool extends StateNode {
  static override id = 'delete-tool'
  static override initial = 'idle'

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
    }

    override onPointerDown() {
        const { currentPagePoint } = this.editor.inputs
        const shapes = this.editor.getShapesAtPoint(currentPagePoint)
        console.log("Shapes at point:", shapes)
        if (shapes.length > 0) {
            const shape = shapes[0]
            console.log("Shape to delete: ", shape.type)
            this.editor.deleteShape(shape.id)
            return
        }
        const allShapes = this.editor.getCurrentPageShapes()
        const arrows = allShapes.filter(shape => shape.type === 'arrow')
        
        // Buscar si alguna flecha está cerca del punto (con un margen)
        for (const arrow of arrows) {
          const arrowShape = arrow as TLArrowShape
          const bounds = this.editor.getShapePageBounds(arrowShape.id)
          
          if (bounds) {
            // Comprobar si el punto está cerca de la flecha (con un margen)
            const margin = 10 // margen de 10px para facilitar selección
            if (this.editor.isPointInShape(arrowShape, currentPagePoint, { margin })) {
              console.log("Arrow to delete:", arrowShape.id)
              this.editor.deleteShape(arrowShape.id)
              return
            }
          }    
        }
    }
}
