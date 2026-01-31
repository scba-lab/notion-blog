import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Initialize notion-to-md
const n2m = new NotionToMarkdown({ notionClient: notion });

// Type definitions
export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  published: boolean;
}

export interface PostWithContent extends Post {
  content: string;
}

// Helper to check if response is a full page
function isFullPage(
  response: any
): response is PageObjectResponse {
  return "properties" in response && response.object === "page";
}

// Helper to extract text from Notion rich text
function getTextFromRichText(richText: any[]): string {
  if (!richText || richText.length === 0) return "";
  return richText.map((text: any) => text.plain_text).join("");
}

// Helper to extract property values
function getPropertyValue(page: PageObjectResponse, propertyName: string): any {
  const property = page.properties[propertyName];
  if (!property) return null;

  switch (property.type) {
    case "title":
      return getTextFromRichText(property.title);
    case "rich_text":
      return getTextFromRichText(property.rich_text);
    case "date":
      return property.date?.start || null;
    case "multi_select":
      return property.multi_select.map((item: any) => item.name);
    case "checkbox":
      return property.checkbox;
    case "select":
      return property.select?.name || null;
    default:
      return null;
  }
}

// Transform Notion page to Post object
function transformPageToPost(page: PageObjectResponse): Post {
  return {
    id: page.id,
    title: getPropertyValue(page, "Title") || getPropertyValue(page, "Name") || "Untitled",
    slug: getPropertyValue(page, "Slug") || page.id,
    date: getPropertyValue(page, "Date") || page.created_time.split("T")[0],
    tags: getPropertyValue(page, "Tags") || [],
    description: getPropertyValue(page, "Description") || "",
    published: getPropertyValue(page, "Published") ?? true,
  };
}

// Get all published posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const posts = response.results
      .filter(isFullPage)
      .map(transformPageToPost);

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    if (!isFullPage(page)) {
      return null;
    }

    const post = transformPageToPost(page);

    // Get page content as markdown
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);

    // toMarkdownString returns an object with a 'parent' property
    const content = typeof mdString === 'string'
      ? mdString
      : (mdString?.parent || "");

    return {
      ...post,
      content,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "Tags",
            multi_select: {
              contains: tag,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.filter(isFullPage).map(transformPageToPost);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return [];
  }
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
