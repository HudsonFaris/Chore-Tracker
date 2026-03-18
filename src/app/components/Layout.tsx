import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-gray-50 sm:items-center sm:py-8">
      <div className="w-full min-h-screen sm:min-h-0 sm:w-[560px] sm:max-h-[90vh] sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-xl bg-white flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}