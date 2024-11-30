import { pageFragment } from "../fragments/page";

export const getPageQuery = /* GraphQL */ `
  query getPage($handle: String!) {
    pageByHandle(handle: $handle) {
      ...page
    }
  }

  ${pageFragment}
`;
