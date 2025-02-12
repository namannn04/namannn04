import dotenv from "dotenv";
dotenv.config();

if (!process.env.ACCESS_TOKEN) {
  console.error("Please provide ACCESS_TOKEN in .env file");
  process.exit(1);
}

import { Octokit } from "@octokit/rest";
import { readFileSync, writeFileSync } from "fs";
import { READMEFILE_PATH } from "./config.js";

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
  request: {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
});

const getLatestWorkflow = async () => {
  const username = "namannn04";
  const repoName = username;

  try {
    const response = await octokit.actions.listWorkflowRunsForRepo({
      owner: username,
      repo: repoName,
      per_page: 1, // Get only the latest workflow
    });

    if (
      response.data.total_count === 0 ||
      response.data.workflow_runs.length === 0
    ) {
      console.warn("No workflows found.");
      return {
        count: 0,
        timeStamp: new Date().toISOString(),
      };
    }

    return {
      count: response.data.total_count,
      timeStamp: response.data.workflow_runs[0].created_at,
    };
  } catch (error) {
    console.error("Error fetching workflows:", error.message);
    return {
      count: 0,
      timeStamp: new Date().toISOString(),
    };
  }
};

export async function updateWorkflowNumber() {
  const workflowDetails = await getLatestWorkflow();
  console.log("Fetched Workflow Details:", workflowDetails);

  const count = workflowDetails.count;
  const time =
    new Date(workflowDetails.timeStamp).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " IST";

  let readmeContent;
  try {
    readmeContent = readFileSync(READMEFILE_PATH, "utf-8");
  } catch (error) {
    console.error("Error reading README file:", error.message);
    return;
  }

  const updatedContent = readmeContent.replace(
    /<!--START_SECTION:workflows-update-->([\s\S]*?)<!--END_SECTION:workflows-update-->/,
    `<!--START_SECTION:workflows-update-->\n
  <p align="center">
    This <i>README</i> file is refreshed <b>every 24 hours</b>!<br/>
    Last refresh: <b>${time}</b><br/>
    Number of workflows: <b>${count}</b><br/><br/>
    Made with ❤️ by <b>Naman Dadhich</b>
  </p>
  <!--END_SECTION:workflows-update-->`,
  );

  try {
    writeFileSync(READMEFILE_PATH, updatedContent, "utf-8");
    console.log(
      `README file updated with the latest workflow count (${count}).`,
    );
  } catch (error) {
    console.error("Error writing README file:", error.message);
  }

  return count;
}
