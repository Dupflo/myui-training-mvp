/**
 * landing-page controller
 */

import { factories } from '@strapi/strapi';
const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// Recursive function to get blocks with their children
const getBlocksWithChildren = async (blockId, startCursor = undefined) => {
  let blocks = [];
  let hasMore = true;
  let cursor = startCursor;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      ...(cursor && { start_cursor: cursor }),  // Inclure start_cursor seulement s'il est défini
    });

    blocks = [...blocks, ...response.results];
    hasMore = response.has_more;
    cursor = response.next_cursor || undefined;  // Éviter "null"
  }

  // Récupère récursivement les enfants pour les blocs qui en ont
  const blocksWithChildren = await Promise.all(
    blocks.map(async (block) => {
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


export default factories.createCoreController('api::landing-page.landing-page', ({ strapi }) => ({
  async find(ctx) {
    const { sanitize, validate } = strapi.contentAPI;
    const contentType = strapi.contentType('api::landing-page.landing-page');
    await validate.query(ctx.query, contentType, { auth: ctx.state.auth });
    const sanitizedQueryParams = await sanitize.query({
      populate: { program: { populate: { image: true } } },
      status: ctx.query.status === "draft" ? "draft" : "published",
    }, contentType, { auth: ctx.state.auth });

    const documents: any = await strapi.documents(contentType.uid).findMany(sanitizedQueryParams);

    try {
      return await sanitize.output(documents, contentType, { auth: ctx.state.auth });
    }
    catch (err) {
      ctx.body = err;
    }
  },
  async findOne(ctx) {
    const { sanitize, validate } = strapi.contentAPI;
    const contentType = strapi.contentType('api::landing-page.landing-page');
    await validate.query(ctx.query, contentType, { auth: ctx.state.auth });
    const sanitizedQueryParams = await sanitize.query({
      populate: { program: { populate: { image: true } } },
      filters: {
        slug: {
          $eq: ctx.params.slug,
        },
      },
      status: ctx.query.status === "draft" ? "draft" : "published",
    }, contentType, { auth: ctx.state.auth });

    const document: any = await strapi.documents(contentType.uid).findFirst(sanitizedQueryParams);

    try {
      const content = await getPage(document.notion_id)
      return await sanitize.output({ ...document, content }, contentType, { auth: ctx.state.auth });
    }
    catch (err) {
      ctx.body = err;
    }
  },
}));
