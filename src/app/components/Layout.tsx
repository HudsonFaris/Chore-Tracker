import { Outlet } from "react-router";

//accodates both types of windows, ipad or anything larger than 560px, and mobile phones. On larger screens, it centers the content in a card-like layout, while on smaller screens, it takes up the full width and height for better usability.

export function Layout() {
  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-gray-50 sm:items-center sm:py-8">
      <div className="w-full min-h-screen sm:min-h-0 sm:w-[560px] sm:max-h-[90vh] sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-xl bg-white flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}