"use client";

import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Public routes are accessible to everyone
  return <>{children}</>;
};
