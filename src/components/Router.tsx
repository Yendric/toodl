import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { FC, lazy, Suspense } from "react";
import Todos from "./Todos/Todos";
import Login from "./Login/Login";
import Error404 from "./Errors/Error404";
import Settings from "./Settings/Settings";
import Register from "./Register/Register";
import Privacy from "./Privacy/Privacy";
import AlgemeneVoorwaarden from "./AlgemeneVoorwaarden/AlgemeneVoorwaarden";
import { CircularProgress, Stack } from "@mui/material";

const Planning = lazy(() => import("./Planning/Planning"));

const Router: FC = () => {
  return (
    <>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/voorwaarden" element={<AlgemeneVoorwaarden />} />

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
                <Todos />
              </PrivateRoute>
            }
          />
          <Route
            path="/planning"
            element={
              <PrivateRoute>
                <Suspense
                  fallback={
                    <Stack alignItems="center">
                      <CircularProgress size={65} sx={{ mt: 5 }}></CircularProgress>
                    </Stack>
                  }
                >
                  <Planning />
                </Suspense>
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Login />} />
          <Route element={<Error404 />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Router;
