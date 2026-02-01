import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  TrackerItem,
  TrackerStatus,
  Priority,
  CreateTrackerItemParams,
  UpdateTrackerItemParams,
} from "@/types/tracker";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Get tracker database ID from environment
const TRACKER_DATABASE_ID = process.env.TRACKER_DATABASE_ID;

if (!TRACKER_DATABASE_ID) {
  console.warn("TRACKER_DATABASE_ID not set in environment variables");
}

// Helper to check if response is a full page
function isFullPage(response: any): response is PageObjectResponse {
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
    case "number":
      return property.number || 0;
    case "relation":
      return property.relation.length > 0 ? property.relation[0].id : null;
    default:
      return null;
  }
}

// Transform Notion page to TrackerItem object
function transformPageToTrackerItem(page: PageObjectResponse): TrackerItem {
  return {
    id: page.id,
    title: getPropertyValue(page, "Title") || "Untitled",
    status: (getPropertyValue(page, "Status") as TrackerStatus) || "Research",
    progress: getPropertyValue(page, "Progress") || 0,
    dueDate: getPropertyValue(page, "Due Date"),
    blogPostId: getPropertyValue(page, "Blog Post"),
    tags: getPropertyValue(page, "Tags") || [],
    priority: (getPropertyValue(page, "Priority") as Priority) || "Medium",
    tasks: getPropertyValue(page, "Tasks") || "",
    xContent: getPropertyValue(page, "X Content") || "",
    linkedInContent: getPropertyValue(page, "LinkedIn Content") || "",
    threadsContent: getPropertyValue(page, "Threads Content") || "",
    contentGenerated: getPropertyValue(page, "Content Generated") || false,
    socialPosted: getPropertyValue(page, "Social Posted") || false,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
}

// Create a new tracker item
export async function createTrackerItem(
  params: CreateTrackerItemParams
): Promise<TrackerItem | null> {
  if (!TRACKER_DATABASE_ID) {
    throw new Error("TRACKER_DATABASE_ID not configured");
  }

  try {
    const properties: any = {
      Title: {
        title: [{ text: { content: params.title } }],
      },
      Status: {
        select: { name: params.status || "Research" },
      },
      Progress: {
        number: params.progress || 0,
      },
      Priority: {
        select: { name: params.priority || "Medium" },
      },
    };

    if (params.dueDate) {
      properties["Due Date"] = {
        date: { start: params.dueDate },
      };
    }

    if (params.tags && params.tags.length > 0) {
      properties.Tags = {
        multi_select: params.tags.map((tag) => ({ name: tag })),
      };
    }

    if (params.tasks) {
      properties.Tasks = {
        rich_text: [{ text: { content: params.tasks } }],
      };
    }

    if (params.blogPostId) {
      properties["Blog Post"] = {
        relation: [{ id: params.blogPostId }],
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: TRACKER_DATABASE_ID },
      properties,
    });

    if (isFullPage(response)) {
      return transformPageToTrackerItem(response);
    }

    return null;
  } catch (error) {
    console.error("Error creating tracker item:", error);
    return null;
  }
}

// Update an existing tracker item
export async function updateTrackerItem(
  params: UpdateTrackerItemParams
): Promise<TrackerItem | null> {
  try {
    const properties: any = {};

    if (params.title !== undefined) {
      properties.Title = {
        title: [{ text: { content: params.title } }],
      };
    }

    if (params.status !== undefined) {
      properties.Status = {
        select: { name: params.status },
      };
    }

    if (params.progress !== undefined) {
      properties.Progress = {
        number: params.progress,
      };
    }

    if (params.priority !== undefined) {
      properties.Priority = {
        select: { name: params.priority },
      };
    }

    if (params.dueDate !== undefined) {
      properties["Due Date"] = params.dueDate
        ? { date: { start: params.dueDate } }
        : { date: null };
    }

    if (params.tags !== undefined) {
      properties.Tags = {
        multi_select: params.tags.map((tag) => ({ name: tag })),
      };
    }

    if (params.tasks !== undefined) {
      properties.Tasks = {
        rich_text: [{ text: { content: params.tasks } }],
      };
    }

    if (params.blogPostId !== undefined) {
      properties["Blog Post"] = params.blogPostId
        ? { relation: [{ id: params.blogPostId }] }
        : { relation: [] };
    }

    if (params.xContent !== undefined) {
      properties["X Content"] = {
        rich_text: [{ text: { content: params.xContent } }],
      };
    }

    if (params.linkedInContent !== undefined) {
      properties["LinkedIn Content"] = {
        rich_text: [{ text: { content: params.linkedInContent } }],
      };
    }

    if (params.threadsContent !== undefined) {
      properties["Threads Content"] = {
        rich_text: [{ text: { content: params.threadsContent } }],
      };
    }

    if (params.contentGenerated !== undefined) {
      properties["Content Generated"] = {
        checkbox: params.contentGenerated,
      };
    }

    if (params.socialPosted !== undefined) {
      properties["Social Posted"] = {
        checkbox: params.socialPosted,
      };
    }

    const response = await notion.pages.update({
      page_id: params.id,
      properties,
    });

    if (isFullPage(response)) {
      return transformPageToTrackerItem(response);
    }

    return null;
  } catch (error) {
    console.error("Error updating tracker item:", error);
    return null;
  }
}

// Get a single tracker item by ID
export async function getTrackerItem(id: string): Promise<TrackerItem | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id });

    if (isFullPage(response)) {
      return transformPageToTrackerItem(response);
    }

    return null;
  } catch (error) {
    console.error("Error fetching tracker item:", error);
    return null;
  }
}

// Get all tracker items
export async function getAllTrackerItems(): Promise<TrackerItem[]> {
  if (!TRACKER_DATABASE_ID) {
    console.error("TRACKER_DATABASE_ID not configured");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: TRACKER_DATABASE_ID,
      sorts: [
        {
          property: "Due Date",
          direction: "ascending",
        },
      ],
    });

    const items = response.results
      .filter(isFullPage)
      .map(transformPageToTrackerItem);

    return items;
  } catch (error) {
    console.error("Error fetching tracker items:", error);
    return [];
  }
}

// Get tracker items by status
export async function getTrackerItemsByStatus(
  status: TrackerStatus
): Promise<TrackerItem[]> {
  if (!TRACKER_DATABASE_ID) {
    console.error("TRACKER_DATABASE_ID not configured");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: TRACKER_DATABASE_ID,
      filter: {
        property: "Status",
        select: {
          equals: status,
        },
      },
      sorts: [
        {
          property: "Due Date",
          direction: "ascending",
        },
      ],
    });

    return response.results.filter(isFullPage).map(transformPageToTrackerItem);
  } catch (error) {
    console.error("Error fetching tracker items by status:", error);
    return [];
  }
}

// Find tracker items without generated social content
export async function getItemsNeedingSocialContent(): Promise<TrackerItem[]> {
  if (!TRACKER_DATABASE_ID) {
    console.error("TRACKER_DATABASE_ID not configured");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: TRACKER_DATABASE_ID,
      filter: {
        and: [
          {
            property: "Status",
            select: {
              equals: "Published",
            },
          },
          {
            property: "Content Generated",
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });

    return response.results.filter(isFullPage).map(transformPageToTrackerItem);
  } catch (error) {
    console.error("Error fetching items needing social content:", error);
    return [];
  }
}

// Update social content for a tracker item
export async function updateSocialContent(
  id: string,
  content: {
    xContent: string;
    linkedInContent: string;
    threadsContent: string;
  }
): Promise<TrackerItem | null> {
  return updateTrackerItem({
    id,
    xContent: content.xContent,
    linkedInContent: content.linkedInContent,
    threadsContent: content.threadsContent,
    contentGenerated: true,
  });
}

// Link tracker item to blog post
export async function linkToBlogPost(
  trackerId: string,
  blogPostId: string
): Promise<TrackerItem | null> {
  return updateTrackerItem({
    id: trackerId,
    blogPostId,
  });
}
