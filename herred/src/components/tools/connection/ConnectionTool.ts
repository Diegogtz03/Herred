import { createShapeId, StateNode, TLArrowShape, TLShapeId, TLArrowShapeProps } from "tldraw";
import { myConnectionStyle } from "../CustomStylePanel";
import { NetworkContextType } from "@/components/types";

// Define a more specific type for our arrow properties
interface CustomArrowProps extends Partial<TLArrowShapeProps> {
    dash: TLArrowShapeProps['dash'];
    color: TLArrowShapeProps['color'];
    arrowheadStart: TLArrowShapeProps['arrowheadStart'];
    arrowheadEnd: TLArrowShapeProps['arrowheadEnd'];
}

export class ConnectionTool extends StateNode {
    static override id = 'connection-tool'
    static override initial = 'idle'

    startShapeId: TLShapeId | null = null
    arrowId: TLShapeId | null = null
    // activeConnectionType is now derived from shared styles

    override onEnter() {
        this.editor.setCursor({ type: 'cross', rotation: 0 })
        this.startShapeId = null
    }

    override onExit() {
        if (this.arrowId && !this.startShapeId) {
            this.editor.deleteShape(this.arrowId);
        }
        this.startShapeId = null
    }

    override onPointerMove() {
        if (!this.startShapeId || !this.arrowId) return

        const { currentPagePoint } = this.editor.inputs
        const arrow = this.editor.getShape<TLArrowShape>(this.arrowId)

        if (arrow) {
            this.editor.updateShape<TLArrowShape>({
                id: this.arrowId,
                type: 'arrow',
                props: {
                    ...arrow.props,
                    end: {
                        x: currentPagePoint.x - arrow.x,
                        y: currentPagePoint.y - arrow.y,
                    }
                }
            })
        }
    }

    override onPointerDown() {
        const { currentPagePoint } = this.editor.inputs
        const hitShape = this.editor.getShapesAtPoint(currentPagePoint)[0]

        if (hitShape && hitShape.type === 'node') {
            if (!this.startShapeId) {
                this.startShapeId = hitShape.id
                this.arrowId = createShapeId()

                const bounds = this.editor.getShapePageBounds(hitShape.id)!
                const startX = bounds.x + bounds.width / 2
                const startY = bounds.y + bounds.height / 2

                // Get active connection type from shared styles
                const sharedStyles = this.editor.getSharedStyles();
                const activeConnectionType = sharedStyles.get(myConnectionStyle) || myConnectionStyle.defaultValue;
                
                const isFiber = activeConnectionType === 'fiber';
                const arrowStyleProps: CustomArrowProps = {
                    dash: isFiber ? 'draw' : 'dashed',
                    color: isFiber ? 'yellow' : 'black',
                    arrowheadStart: 'none',
                    arrowheadEnd: 'none',
                };

                this.editor.createShape<TLArrowShape>({
                    id: this.arrowId,
                    type: 'arrow',
                    x: startX,
                    y: startY,
                    props: {
                        start: { x: 0, y: 0 },
                        end: { x: currentPagePoint.x - startX, y: currentPagePoint.y - startY },
                        ...arrowStyleProps,
                    }
                })

                this.editor.createBinding({
                    fromId: this.arrowId,
                    toId: this.startShapeId!,
                    type: 'arrow',
                    props: {
                        terminal: 'start',
                        normalizedAnchor: { x: 0.5, y: 0.5 }
                    }
                })
            } else {
                const endShapeId = hitShape.id
                this.editor.createBinding({
                    fromId: this.arrowId!,
                    toId: endShapeId,
                    type: 'arrow',
                    props: {
                        terminal: 'end',
                        normalizedAnchor: { x: 0.5, y: 0.5 }
                    }
                })

                if (this.arrowId && this.startShapeId) {
                    // Access addConnection from the extended editor instance
                    const appState = (this.editor as any).appState as { addConnection?: NetworkContextType['addConnection'] };
                    if (appState?.addConnection) {
                        const sharedStyles = this.editor.getSharedStyles();
                        const activeConnectionType = (sharedStyles.get(myConnectionStyle) || myConnectionStyle.defaultValue) as 'fiber' | 'microwave';
                        const capacity = 0; // Default capacity for new connections
                        appState.addConnection(this.arrowId.toString(), this.startShapeId.toString(), endShapeId.toString(), activeConnectionType, capacity);
                    } else {
                        console.warn("addConnection function not found on editor.appState");
                    }
                }

                this.editor.setCurrentTool('select')
                this.editor.select(this.arrowId!)
                this.startShapeId = null
            }
        } else if (this.startShapeId && this.arrowId) {
            this.editor.deleteShape(this.arrowId)
            this.startShapeId = null
            this.arrowId = null 
        }
    }

    override onCancel() {
        if (this.arrowId) {
            this.editor.deleteShape(this.arrowId)
        }
        this.startShapeId = null
        this.arrowId = null
        this.editor.setCurrentTool('select')
    }
}