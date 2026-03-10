import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomeDashboard } from "./components/HomeDashboard";
import { RealTimeInteraction } from "./components/RealTimeInteraction";
import { InteractionAnalysis } from "./components/InteractionAnalysis";
import { InteractionHistory } from "./components/InteractionHistory";
// import { AtmosphereMap } from "./components/AtmosphereMap";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: HomeDashboard },
          { path: "realtime", Component: RealTimeInteraction },
          { path: "analysis", Component: InteractionAnalysis },
          { path: "history", Component: InteractionHistory },
          // { path: "map", Component: AtmosphereMap },
          { path: "settings", Component: Settings },
        ],
      },
    ],
  },
]);