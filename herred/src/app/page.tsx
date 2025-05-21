"use client";

import { Tldraw } from "tldraw";
import { useState } from "react";
import Header from "@/components/layout/Header";
import BodyCanvas from "@/components/layout/BodyTemplate";
import "tldraw/tldraw.css";
import { NetworkProvider } from "@/components/Context";
import TldrawContextHandler from "@/components/tldraw/TldrawContextHandler";
import { NodeAsset } from "@/components/tools/node/NodeAsset";
import {
  customTools,
  customUiOverrides,
  customAssetsUrls,
  customComponents,
} from "@/components/tools/overrides";

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
          >
            <TldrawContextHandler />
          </Tldraw>
        </BodyCanvas>
      </div>
    </NetworkProvider>
  );
}
