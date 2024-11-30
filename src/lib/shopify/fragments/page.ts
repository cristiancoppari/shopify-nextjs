import seoFragment from "./seo";

export const pageFragment = /* GraphQL */ `
  fragment page on Page {
    ... on Page {
      id
      handle
      title
      body
      bodySummary
      createdAt
      updatedAt
      seo {
        ...seo
      }
    }
  }

  ${seoFragment}
`;
