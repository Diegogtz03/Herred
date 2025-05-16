"use client";

import { Tldraw } from "tldraw";
import { useState } from "react";
import Header from "@/components/layout/Header";
import BodyCanvas from "@/components/layout/BodyTemplate";
import "tldraw/tldraw.css";

import {
  customTools,
  customUiOverrides,
  customAssetsUrls,
  customComponents,
} from "@/components/tools/overrides";
import { NodeAsset } from "@/components/tools/node/NodeAsset";
import { NetworkProvider } from "@/components/Context";

export default function Home() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <NetworkProvider>
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
        />
      </BodyCanvas>
    </div>
    </NetworkProvider>
  );
}
