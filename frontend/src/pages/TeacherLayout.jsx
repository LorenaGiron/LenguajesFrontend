import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/TeacherSidebar";
import Topbar from "../components/layout/Topbar";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen bg-grisC">
      {/* Sidebar - ancho fijo */}
      <div className="w-64 h-screen fixed left-0 top-0 z-40">
        <Sidebar />
      </div>
      
      {/* Main Content - con margen izquierdo para el sidebar */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Topbar - fijo en la parte superior */}
        <div className="fixed top-0 left-64 right-0 z-30">
          <Topbar />
        </div>
        
        {/* Content Area - con padding-top para dejar espacio al topbar */}
        <div className="flex-1 overflow-auto bg-grisC pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}