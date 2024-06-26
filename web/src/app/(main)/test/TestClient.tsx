"use client";

import { useQuery } from "@tanstack/react-query";

export default function TestClient() {
  const data = useQuery({
    queryKey: ["test"],
    queryFn: async () => await (await fetch(`/api/test`, { cache: "no-store" })).json(),
    refetchInterval: 1000,
  });

  return <div>{JSON.stringify(data)}</div>;
}
