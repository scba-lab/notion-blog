#!/usr/bin/env node

/**
 * Interactive Social Content Generator
 *
 * This script:
 * 1. Finds published blog posts without social content
 * 2. Displays them to the user
 * 3. Reads the blog post content
 * 4. Provides content to Claude Code for social content generation
 * 5. Prompts user to provide generated content
 * 6. Saves to Notion tracker database
 */

import { getAllPosts, getPostBySlug } from "../lib/notion";
import {
  getAllTrackerItems,
  getItemsNeedingSocialContent,
  updateSocialContent,
  createTrackerItem,
} from "../lib/notion-tracker";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n🚀 Social Content Generator\n");
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

    // Step 8: Show content preview
    const contentPreview = fullPost.content.substring(0, 500);
    console.log("📄 Content Preview:");
    console.log("-" .repeat(50));
    console.log(contentPreview);
    if (fullPost.content.length > 500) {
      console.log("\n[... content continues ...]");
    }
    console.log("-" .repeat(50));
    console.log();

    // Step 9: Provide instructions for Claude Code
    console.log("=" .repeat(50));
    console.log("GENERATE SOCIAL CONTENT");
    console.log("=" .repeat(50));
    console.log();
    console.log("📝 Now, ask Claude Code to generate social content!");
    console.log();
    console.log("Example prompt:");
    console.log("-" .repeat(50));
    console.log(`Generate social media content for this blog post:

Title: ${fullPost.title}
Description: ${fullPost.description}
Tags: ${fullPost.tags.join(", ")}

Please create:
1. X (Twitter) thread (9 tweets, 280 chars each)
2. LinkedIn post (professional tone, 1300-2000 chars)
3. Threads post (casual, engaging, 9 posts)

Make sure content captures the key insights and is platform-appropriate.`);
    console.log("-" .repeat(50));
    console.log();

    const proceed = await question("Have you generated the content? (y/n): ");

    if (proceed.toLowerCase() !== "y") {
      console.log("\n👋 Come back when content is ready!\n");
      rl.close();
      return;
    }

    // Step 10: Collect generated content
    console.log("\n📥 Paste the generated content:\n");

    console.log("X (Twitter) content:");
    console.log("(Paste all tweets separated by '---', then press Enter twice)\n");
    const xContent = await readMultilineInput();

    console.log("\nLinkedIn content:");
    console.log("(Paste the post, then press Enter twice)\n");
    const linkedInContent = await readMultilineInput();

    console.log("\nThreads content:");
    console.log("(Paste all posts separated by '---', then press Enter twice)\n");
    const threadsContent = await readMultilineInput();

    // Step 11: Save to Notion
    console.log("\n💾 Saving to Notion tracker database...\n");

    const updated = await updateSocialContent(selectedItem.id, {
      xContent: xContent.trim(),
      linkedInContent: linkedInContent.trim(),
      threadsContent: threadsContent.trim(),
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

async function readMultilineInput(): Promise<string> {
  const lines: string[] = [];
  let emptyLineCount = 0;

  return new Promise((resolve) => {
    const handler = (line: string) => {
      if (line.trim() === "") {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.removeListener("line", handler);
          resolve(lines.join("\n"));
          return;
        }
      } else {
        emptyLineCount = 0;
        lines.push(line);
      }
    };

    rl.on("line", handler);
  });
}

// Run the script
main();
