import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { ChoreListPage } from "./components/ChoreListPage";
import { ChoreDetailPage } from "./components/ChoreDetailPage";
import { ProfilePage } from "./components/ProfilePage";
import { CreateChorePage } from "./components/CreateChorePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LoginPage },
      { path: "home", Component: HomePage },
      { path: "chores", Component: ChoreListPage },
      { path: "chores/create", Component: CreateChorePage },
      { path: "chore/:id", Component: ChoreDetailPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);