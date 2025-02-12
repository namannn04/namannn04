import dotenv from "dotenv";
dotenv.config();

if (process.env.ACCESS_TOKEN === undefined) {
  console.error("Please provide ACCESS_TOKEN in .env file");
  process.exit(1);
}

import { Octokit } from "@octokit/rest";
import { readFileSync, writeFileSync } from "fs";
import { READMEFILE_PATH } from "./config.js";

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
});

const getLatestFollowers = async () => {
  const username = "namannn04";
  try {
    const { data } = await octokit.rest.users.listFollowersForAuthenticatedUser(
      {
        username: username,
        per_page: 100,
      },
    );

    const followers = data.map((follower) => ({
      profileUrl: follower.html_url,
      picUrl: follower.avatar_url,
    }));

    // Sorting followers alphabetically by profile URL
    followers.sort((a, b) => a.profileUrl.localeCompare(b.profileUrl));

    return followers;
  } catch (error) {
    console.error("Error fetching followers:", error.message);
  }
};

export async function handleFetchFollowers() {
  const followers = await getLatestFollowers();
  if (!followers) {
    console.error("No followers fetched");
    return;
  }

  const followersLength = followers.length;
  let readmeContent;

  try {
    readmeContent = readFileSync(READMEFILE_PATH, "utf-8");
  } catch (error) {
    console.error("Error reading README file:", error.message);
    return;
  }

  console.log("Original README content:", readmeContent);

  // Fixing case sensitivity issue in regex
  readmeContent = readmeContent.replace(
    /<!--START_SECTION:top-followers-heading-->\n*[\s\S]*?\n*<!--End_SECTION:top-followers-heading-->/i,
    `<!--START_SECTION:top-followers-heading-->\n### :sparkles: [My followers (${followersLength})](https://github.com/namannn04?tab=followers)\n<!--End_SECTION:top-followers-heading-->`,
  );

  readmeContent = readmeContent.replace(
    /<!--START_SECTION:top-followers-->\n*[\s\S]*?\n*<!--END_SECTION:top-followers-->/i,
    `<!--START_SECTION:top-followers-->\n<div style="display: flex; justify-content: center; flex-wrap: wrap;">` +
      followers
        .map(
          (follower) =>
            `<a href="${follower.profileUrl}" target="_blank"><img src="${follower.picUrl}" alt="Follower" width="50" height="50" style="border-radius: 50%; margin: 3px;"/></a>`,
        )
        .join("\n") +
      `</div>\n<!--END_SECTION:top-followers-->`,
  );

  try {
    writeFileSync(READMEFILE_PATH, readmeContent);
  } catch (error) {
    console.error("Error writing README file:", error.message);
    return;
  }
  return followers;
}
