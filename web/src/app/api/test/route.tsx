import { graphql } from "@/data/generated/ponder";
import { graphQLFetch } from "@/data/utils/graphQLFetch";

const query = graphql(/* GraphQL */ `
  query Test {
    users {
      items {
        address
        baseNounsErc20Balance
        mainnetNounsErc20Balance
      }
    }
  }
`);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const INDEXER_URL = "http://indexer.railway.internal:42069"; // `http://${process.env.INDEXER_DOMAIN}:${process.env.INDEXER_PORT}`;
  console.log("INDEXER URL", INDEXER_URL);
  const data = await graphQLFetch(INDEXER_URL, query as any, {}, { cache: "no-store" });
  // const data = await graphQLFetch("http://localhost:42069", query as any, {}, { cache: "no-store" });
  return Response.json(data);
}
