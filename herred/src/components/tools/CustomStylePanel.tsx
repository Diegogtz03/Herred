import {
  DefaultStylePanel,
  Editor,
  StyleProp,
  T,
  TLBaseShape,
  useEditor,
  useRelevantStyles,
} from "tldraw";

import Image from "next/image";

const NODE_TYPES = [
  {
    type: "central",
    icon: "/icons/tools/central_node.svg",
  },
  {
    type: "leaf",
    icon: "/icons/tools/node.svg",
  },
  {
    type: "proposal",
    icon: "/icons/tools/proposal_node.svg",
  },
];

export const myNodeStyle = StyleProp.defineEnum("myNodeStyle", {
  defaultValue: "central",
  values: ["central", "leaf", "proposal"],
});

type MyNodeStyle = T.TypeOf<typeof myNodeStyle>;

export type NodeShape = TLBaseShape<
  "node",
  {
    w: number;
    h: number;
    nodeType: MyNodeStyle;
  }
>;

export function CustomStylePanel() {
  const editor = useEditor();
  const relevantStyles = useRelevantStyles();

  if (!relevantStyles) return null;

  const nodeStyle = relevantStyles.get(myNodeStyle);

  return (
    <DefaultStylePanel>
      {nodeStyle !== undefined && <NodePicker editor={editor} />}
    </DefaultStylePanel>
  );
}

function NodePicker({ editor }: { editor: Editor }) {
  return (
    <div className="w-full">
      {NODE_TYPES.map((type, index) => (
        <div key={type.type} className="flex flex-col justify-center gap-1">
          {index > 0 && <div className="h-px bg-gray-200" />}
          <button
            key={type.type}
            className="flex items-center gap-1 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 m-1 cursor-pointer active:bg-gray-200"
            onClick={() => {
              editor.markHistoryStoppingPoint();
              const value = type.type as MyNodeStyle;
              editor.setStyleForSelectedShapes(myNodeStyle, value);
            }}
          >
            <Image src={type.icon} alt={type.type} width={34} height={34} />
            <span className="text-[14px] text-gray-500">{type.type}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
