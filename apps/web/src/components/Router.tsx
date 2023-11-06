import { CircularProgress, Stack } from "@mui/material";
import { FC, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { CurrentListProvider } from "../context/CurrentListState";
import LandingContainer from "./Landing/LandingContainer";
import ScrollToTop from "./Partials/ScrollToTop";
import PrivateRoute from "./PrivateRoute";

const Planning = lazy(() => import("./Planning/PlanningContainer"));
const Settings = lazy(() => import("./Settings/SettingsContainer"));
const Error404 = lazy(() => import("./Errors/Error404"));
const TodoContainer = lazy(() => import("./Todos/TodoContainer"));
const LoginContainer = lazy(() => import("./Login/LoginContainer"));
const RegisterContainer = lazy(() => import("./Register/RegisterContainer"));
const PrivacyContainer = lazy(() => import("./Privacy/PrivacyContainer"));
const AlgemeneVoorwaardenContainer = lazy(() => import("./AlgemeneVoorwaarden/AlgemeneVoorwaardenContainer"));

const Router: FC = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <Stack alignItems="center">
            <CircularProgress size={65} sx={{ mt: 5 }}></CircularProgress>
          </Stack>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/privacy" element={<PrivacyContainer />} />
          <Route path="/voorwaarden" element={<AlgemeneVoorwaardenContainer />} />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <CurrentListProvider>
                  <TodoContainer />
                </CurrentListProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/planning"
            element={
              <PrivateRoute>
                <Planning />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<LandingContainer />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Router;
