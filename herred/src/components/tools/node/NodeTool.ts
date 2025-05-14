import { StateNode } from "tldraw";

export class NodeTool extends StateNode {
  static override id = 'node-selection'
  static override initial = 'idle'

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }
}
