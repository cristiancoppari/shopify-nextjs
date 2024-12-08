import { collectionFragment } from "../fragments/collection";

export const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
        items {
          title
          url
          resource {
            ...collection
          }
        }
      }
    }
  }
  ${collectionFragment}
`;
