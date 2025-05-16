import React, { useState, useRef, useEffect, useContext } from 'react';
import SidebarNetworkInfo from './SidebarNetworkInfo';
import { NetworkContext } from '../Context';


export default function Sidebar() {

  const { sidePanelInfo } = useContext(NetworkContext);

  return (
    <div className=' text-gray-500 mt-3 truncate p-4'>
      {sidePanelInfo == 'general' ? 
        ( <SidebarNetworkInfo/>) :
        //TODO: Crear componente de Side bar de nodos
        <div></div>
      }
    </div>
  );
}



