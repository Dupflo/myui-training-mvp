const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// Recursive function to get blocks with their children
const getBlocksWithChildren = async (blockId) => {
  const blocks = await notion.blocks.children.list({ block_id: blockId });

  // Process blocks to fetch children for those that can have them
  const blocksWithChildren = await Promise.all(
    blocks.results.map(async (block) => {
      // These block types can have children
      if (block.has_children) {
        const children = await getBlocksWithChildren(block.id);
        return { ...block, children };
      }
      return block;
    })
  );

  return blocksWithChildren;
};

const getPage = async (pageId) => {
  const info = await notion.pages.retrieve({ page_id: pageId });
  // Recursively get all blocks with their children
  const content = await getBlocksWithChildren(pageId);
  return { info, content };
}

export default {
  exampleAction: async (ctx, next) => {
    try {
      const pageId = "18a644761ffa80ada73efb74094a5789"; // ID of the page Notion
      ctx.body = await getPage(pageId);
    } catch (err) {
      ctx.body = err;
    }
  }
};