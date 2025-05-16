"use client";

import { Tldraw } from "tldraw";
import { useState } from "react";
import Header from "@/components/layout/Header";
import BodyTemplate from "@/components/layout/BodyTemplate";
import Sidebar from "@/components/sidebar/Sidebar";
import "tldraw/tldraw.css";
import {
  customTools,
  customUiOverrides,
  customAssetsUrls,
  customComponents,
} from "@/components/tools/overrides";
import { NodeAsset } from "@/components/tools/node/NodeAsset";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-full w-full flex flex-col">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <BodyTemplate isSidebarOpen={isSidebarOpen} sidebarContent={<Sidebar />}>
        <Tldraw
          shapeUtils={[NodeAsset]}
          tools={customTools}
          overrides={customUiOverrides}
          assetUrls={customAssetsUrls}
          components={customComponents}
        />
      </BodyTemplate>
    </div>
  );
}
