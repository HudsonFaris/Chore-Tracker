import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      {/* iPhone frame */}
      <div className="w-[390px] h-[844px] bg-white overflow-hidden border border-gray-300 shadow-lg flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
