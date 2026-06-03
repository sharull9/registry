"use client";

import { getQueryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
