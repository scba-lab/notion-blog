#!/usr/bin/env node

/**
 * Automated Social Content Generator
 *
 * This script:
 * 1. Finds published blog posts without social content
 * 2. Displays them to the user
 * 3. Reads the blog post content
 * 4. Automatically generates social content using Claude API
 * 5. Saves to Notion tracker database
 */

// Load environment variables from .env.local
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { getAllPosts, getPostBySlug } from "../lib/notion";
import {
  getAllTrackerItems,
  getItemsNeedingSocialContent,
  updateSocialContent,
  createTrackerItem,
} from "../lib/notion-tracker";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SocialContent {
  xContent: string;
  linkedInContent: string;
  threadsContent: string;
}

async function generateSocialContent(
  title: string,
  description: string,
  tags: string[],
  content: string
): Promise<SocialContent> {
  console.log("\n🤖 Generating social content with Claude Haiku...\n");

  const prompt = `Generate social media content for this blog post:

Title: ${title}
Description: ${description}
Tags: ${tags.join(", ")}

Content Preview (first 2000 chars):
${content.substring(0, 2000)}${content.length > 2000 ? "..." : ""}

Please create three sections:

1. X (Twitter) Thread:
   - Create 9 tweets, each under 280 characters
   - Separate each tweet with "---"
   - Start with "Tweet 1/9:", "Tweet 2/9:", etc.
   - Make it engaging and thread-worthy
   - Focus on key insights and takeaways

2. LinkedIn Post:
   - Professional tone, 1300-2000 characters
   - Include emojis for visual appeal
   - Add relevant hashtags at the end
   - Focus on business value and lessons learned

3. Threads Post:
   - Create 9 posts, casual and engaging tone
   - Separate each post with "---"
   - Start with "Post 1/9:", "Post 2/9:", etc.
   - Make it conversational and approachable

Format your response EXACTLY like this:

=== X CONTENT ===
Tweet 1/9:
[tweet content]

---

Tweet 2/9:
[tweet content]

(etc for all 9 tweets)

=== LINKEDIN CONTENT ===
[linkedin post content]

=== THREADS CONTENT ===
Post 1/9:
[post content]

---

Post 2/9:
[post content]

(etc for all 9 posts)`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedContent = response.content[0].type === "text"
      ? response.content[0].text
      : "";

    // Parse the response
    const xMatch = generatedContent.match(/=== X CONTENT ===([\s\S]*?)(?:=== LINKEDIN CONTENT ===|$)/);
    const linkedInMatch = generatedContent.match(/=== LINKEDIN CONTENT ===([\s\S]*?)(?:=== THREADS CONTENT ===|$)/);
    const threadsMatch = generatedContent.match(/=== THREADS CONTENT ===([\s\S]*?)$/);

    const xContent = xMatch ? xMatch[1].trim() : "";
    const linkedInContent = linkedInMatch ? linkedInMatch[1].trim() : "";
    const threadsContent = threadsMatch ? threadsMatch[1].trim() : "";

    console.log("✅ Social content generated successfully!\n");
    console.log(`📊 Generated:`);
    console.log(`   X: ${xContent.split("---").length} tweets`);
    console.log(`   LinkedIn: ${linkedInContent.length} characters`);
    console.log(`   Threads: ${threadsContent.split("---").length} posts\n`);

    return {
      xContent,
      linkedInContent,
      threadsContent,
    };
  } catch (error) {
    console.error("❌ Error generating content:", error);
    throw error;
  }
}

async function main() {
  console.log("\n🚀 Social Content Generator (Automated)\n");
  console.log("=" .repeat(50));

  try {
    // Step 1: Find published posts
    console.log("\n📝 Checking for published blog posts...\n");
    const allPosts = await getAllPosts();

    if (allPosts.length === 0) {
      console.log("❌ No published blog posts found.");
      console.log("   Publish a post in Notion first!\n");
      rl.close();
      return;
    }

    console.log(`✅ Found ${allPosts.length} published post(s)\n`);

    // Step 2: Check tracker for existing items
    console.log("🔍 Checking tracker database...\n");
    const trackerItems = await getAllTrackerItems();
    const itemsNeedingContent = await getItemsNeedingSocialContent();

    console.log(`📊 Tracker Stats:`);
    console.log(`   Total items: ${trackerItems.length}`);
    console.log(`   Needing social content: ${itemsNeedingContent.length}\n`);

    // Step 3: Find posts without tracker items
    const postsWithoutTracker = allPosts.filter(
      (post) => !trackerItems.some((item) => item.title === post.title)
    );

    if (postsWithoutTracker.length > 0) {
      console.log("⚠️  Posts without tracker items:");
      postsWithoutTracker.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}"`);
      });
      console.log("\n💡 Tip: Create tracker items for these posts in Notion\n");
    }

    // Step 4: Display posts needing social content
    if (itemsNeedingContent.length === 0) {
      console.log("✨ All published posts have social content generated!");
      console.log("\n💡 Options:");
      console.log("   1. Publish a new blog post in Notion");
      console.log("   2. Mark existing tracker items as 'Published'\n");
      rl.close();
      return;
    }

    console.log("📋 Posts needing social content:\n");
    itemsNeedingContent.forEach((item, index) => {
      console.log(`${index + 1}. "${item.title}"`);
      console.log(`   Status: ${item.status}`);
      console.log(`   Progress: ${item.progress}%`);
      if (item.dueDate) {
        console.log(`   Due: ${item.dueDate}`);
      }
      console.log();
    });

    // Step 5: Ask user which post to generate content for
    const choice = await question(
      `Which post would you like to generate social content for? (1-${itemsNeedingContent.length}, or 'q' to quit): `
    );

    if (choice.toLowerCase() === "q") {
      console.log("\n👋 Goodbye!\n");
      rl.close();
      return;
    }

    const choiceNum = parseInt(choice);
    if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > itemsNeedingContent.length) {
      console.log("\n❌ Invalid choice. Exiting.\n");
      rl.close();
      return;
    }

    const selectedItem = itemsNeedingContent[choiceNum - 1];
    console.log(`\n✅ Selected: "${selectedItem.title}"\n`);

    // Step 6: Find the matching blog post
    const matchingPost = allPosts.find((post) => post.title === selectedItem.title);

    if (!matchingPost) {
      console.log("❌ Could not find matching blog post.");
      console.log("   Make sure the tracker title matches the blog post title.\n");
      rl.close();
      return;
    }

    console.log("📖 Fetching blog post content...\n");
    const fullPost = await getPostBySlug(matchingPost.slug);

    if (!fullPost) {
      console.log("❌ Could not fetch blog post content.\n");
      rl.close();
      return;
    }

    // Step 7: Display content summary
    console.log("=" .repeat(50));
    console.log("BLOG POST SUMMARY");
    console.log("=" .repeat(50));
    console.log(`Title: ${fullPost.title}`);
    console.log(`Slug: ${fullPost.slug}`);
    console.log(`Description: ${fullPost.description}`);
    console.log(`Tags: ${fullPost.tags.join(", ")}`);
    console.log(`Content length: ${fullPost.content.length} characters`);
    console.log(`Word count: ~${fullPost.content.split(/\s+/).length} words`);
    console.log("=" .repeat(50));
    console.log();

    // Step 8: Auto-generate social content
    const socialContent = await generateSocialContent(
      fullPost.title,
      fullPost.description,
      fullPost.tags,
      fullPost.content
    );

    // Step 9: Save to Notion
    console.log("💾 Saving to Notion tracker database...\n");

    const updated = await updateSocialContent(selectedItem.id, {
      xContent: socialContent.xContent,
      linkedInContent: socialContent.linkedInContent,
      threadsContent: socialContent.threadsContent,
    });

    if (updated) {
      console.log("✅ Social content saved successfully!\n");
      console.log("=" .repeat(50));
      console.log("NEXT STEPS");
      console.log("=" .repeat(50));
      console.log("1. Open your Notion tracker database");
      console.log("2. Find the item: " + updated.title);
      console.log("3. Review the generated content");
      console.log("4. Copy and post to social platforms");
      console.log("5. Mark 'Social Posted' checkbox when done");
      console.log("=" .repeat(50));
      console.log();
    } else {
      console.log("❌ Failed to save content to Notion.\n");
    }
  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    rl.close();
  }
}

// Run the script
main();
