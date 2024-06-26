import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";
import TestClient from "./TestClient";

export default async function TestPage() {
  return (
    <div>
      TEST PAGE: <TestClient />
    </div>
  );
}

export const dynamic = "force-dynamic";
