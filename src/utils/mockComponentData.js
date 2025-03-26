// Mock data for different component types
export const MOCK_COMPONENTS = {
  ATTACHMENT: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: { attachments: ['image:https://example.com/product-photo.jpg'] },
    }),
  },
  TEXT_WITH_ATTACHMENT: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: {
        text: 'Here is the catalog you requested:',
        attachments: ['pdf:https://example.com/catalog.pdf'],
      },
    }),
  },
  QUICK_REPLIES: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: {
        text: 'How would you like to receive your order?',
        quick_replies: ['Delivery', 'Store pickup'],
      },
    }),
  },
  LIST_MESSAGE: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: {
        text: 'Choose a category:',
        interaction_type: 'list',
        list_message: {
          button_text: 'View categories',
          list_items: [
            {
              title: 'Smartphones',
              description: 'iPhone, Samsung and more',
              uuid: 'cat_001',
            },
            {
              title: 'Notebooks',
              description: 'Dell, Lenovo, Acer',
              uuid: 'cat_002',
            },
          ],
        },
      },
    }),
  },
  CTA_MESSAGE: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: {
        text: 'Visit our online store!',
        interaction_type: 'cta_url',
        cta_url: {
          url: 'https://mystore.com',
          display_text: 'See offers 🏷️',
        },
      },
    }),
  },
  CATALOG: {
    type: 'broadcast',
    message: JSON.stringify({
      msg: {
        text: 'I found some stylish shirts. Here are two options: a Blue Textured Cotton Shirt and a Cotton Boxy Shirt. Would you like to see any of these in detail?',
        header: { text: '🏆 Premium Line', type: 'text' },
        footer: 'Free shipping nationwide',
        catalog_message: {
          send_catalog: false,
          action_button_name: 'flow',
          products: [
            {
              product: 'Blue Textured Cotton Shirt',
              description:
                "Men's shirt, made from cotton with a viscose texture",
              price: 99,
              currency: '$',
              product_retailer_ids: ['PAN789#a'],
            },
            {
              product: 'Cotton Boxy Shirt',
              description: "Men's boxy shirt made from cotton",
              price: 99,
              currency: '$',
              product_retailer_ids: ['PAN101#a'],
            },
          ],
          action_button_text: 'View catalog',
        },
      },
    }),
  },
};
