"use client";

import { Tldraw } from "tldraw";
import { useState } from "react";
import Header from "@/components/layout/Header";
import BodyCanvas from "@/components/layout/BodyTemplate";
import "tldraw/tldraw.css";
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
        <Tldraw/>
      </BodyCanvas>
    </div>
    </NetworkProvider>
  );
}
