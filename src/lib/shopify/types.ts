export type Menu = {
  title: string;
  path: string;
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: Array<{
        title: string;
        url: string;
      }>;
    };
  };
  variables: {
    handle: string;
  };
};
