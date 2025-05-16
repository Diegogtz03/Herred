import {  StateNode } from "tldraw"

export class DeleteTool extends StateNode {
  static override id = 'delete-tool'
  static override initial = 'idle'

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
    }

    override onPointerDown() {
        const { currentPagePoint } = this.editor.inputs
        const shape = this.editor.getShapeAtPoint(currentPagePoint)
        if(shape!=null){
            console.log("Shape to delete:", shape.type)
            this.editor.deleteShape(shape.id)
        }
    
    }
}
