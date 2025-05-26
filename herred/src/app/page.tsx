"use client";

import { Editor, Tldraw, TldrawApp } from "tldraw";
import { useState, useRef, useContext, useEffect } from "react";
import Header from "@/components/layout/Header";
import BodyCanvas from "@/components/layout/BodyTemplate";
import "tldraw/tldraw.css";
import { NetworkProvider, NetworkContext } from "@/components/Context";
import TldrawContextHandler from "@/components/tldraw/TldrawContextHandler";
import { NodeAsset } from "@/components/tools/node/NodeAsset";
import {
  customTools,
  customUiOverrides,
  customAssetsUrls,
  customComponents,
} from "@/components/tools/overrides";
import React from "react";

export const EditorContext = React.createContext<Editor | null>(null);

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const editorRef = useRef<Editor | null>(null);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const networkContext = useContext(NetworkContext);

  const handleMount = (editor: Editor) => {
    editorRef.current = editor;
    setEditorInstance(editor);
    (editor as any).appState = {
      addConnection: networkContext.addConnection,
    };
  };
  
  useEffect(() => {
    if (editorRef.current && networkContext.addConnection !== (editorRef.current as any).appState?.addConnection) {
      (editorRef.current as any).appState = {
        ...((editorRef.current as any).appState || {}),
        addConnection: networkContext.addConnection,
      };
    }
  }, [networkContext.addConnection]);

  return (
    <NetworkProvider>
      <EditorContext.Provider value={editorInstance}>
        <div className="h-full w-full flex flex-col">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <BodyCanvas isSidebarOpen={isSidebarOpen}>
            <Tldraw
              shapeUtils={[NodeAsset]}
              tools={customTools}
              overrides={customUiOverrides}
              assetUrls={customAssetsUrls}
              components={customComponents}
              onMount={handleMount}
            >
              <TldrawContextHandler />
            </Tldraw>
          </BodyCanvas>
        </div>
      </EditorContext.Provider>
    </NetworkProvider>
  );
}
