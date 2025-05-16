import Image from "next/image";
import { BaseBoxShapeUtil, T, HTMLContainer } from "tldraw";
import { NodeShape, myNodeStyle } from "../CustomStylePanel";

export class NodeAsset extends BaseBoxShapeUtil<NodeShape> {
  static override type = "node" as const;

  static override props = {
    w: T.number,
    h: T.number,
    nodeType: myNodeStyle,
  };

  getDefaultProps(): NodeShape["props"] {
    return {
      w: 50,
      h: 50,
      nodeType: "central",
    };
  }

  component(shape: NodeShape) {
    return (
      <HTMLContainer id={shape.id}>
        <Image
          src={
            shape.props.nodeType === "central"
              ? "/icons/tools/central_node.svg"
              : shape.props.nodeType === "leaf"
              ? "/icons/tools/node.svg"
              : "/icons/tools/proposal_node.svg"
          }
          alt="Node"
          width={shape.props.w}
          height={shape.props.h}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: NodeShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
