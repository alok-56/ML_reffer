import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthMiddleware from "./Routes/AuthMiddleware";
import AppRoute from "./Routes/Route";

import "./App.css";
import MainLayout from "./Components/MainLayout";

function App() {
  return (
    <Routes>
      {AppRoute.map(({ name, Component, route, private: isPrivate }) => {
        const isLoginPage = route === "/login";
        return (
          <Route
            key={name}
            path={route}
            element={
              isLoginPage ? (
                <Component />
              ) : (
                <MainLayout>
                  {isPrivate ? (
                    <AuthMiddleware>
                      <Component />
                    </AuthMiddleware>
                  ) : (
                    <Component />
                  )}
                </MainLayout>
              )
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
