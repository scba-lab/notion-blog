// Content Tracker Types

export interface TrackerItem {
  id: string;
  title: string;
  status: TrackerStatus;
  progress: number; // 0-100
  dueDate: string | null;
  blogPostId: string | null; // Notion page ID of related blog post
  tags: string[];
  priority: Priority;
  tasks: string; // Multi-step breakdown as text
  xContent: string;
  linkedInContent: string;
  threadsContent: string;
  contentGenerated: boolean;
  socialPosted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TrackerStatus =
  | "Research"
  | "Outline"
  | "Draft"
  | "Edit"
  | "Review"
  | "Published"
  | "Promoted";

export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface CreateTrackerItemParams {
  title: string;
  status?: TrackerStatus;
  progress?: number;
  dueDate?: string;
  blogPostId?: string;
  tags?: string[];
  priority?: Priority;
  tasks?: string;
}

export interface UpdateTrackerItemParams {
  id: string;
  title?: string;
  status?: TrackerStatus;
  progress?: number;
  dueDate?: string;
  blogPostId?: string;
  tags?: string[];
  priority?: Priority;
  tasks?: string;
  xContent?: string;
  linkedInContent?: string;
  threadsContent?: string;
  contentGenerated?: boolean;
  socialPosted?: boolean;
}

export interface SocialContent {
  x: string;
  linkedIn: string;
  threads: string;
}

export interface GenerateSocialContentParams {
  blogPostSlug: string;
  blogPostTitle: string;
  blogPostContent: string;
  blogPostDescription: string;
  blogPostTags: string[];
}
