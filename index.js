import { Server } from "@anthropic-ai/claude-desktop-mcp-sdk";
import fs from "fs";
import path from "path";

// Root folder restriction
const ROOT = "C:\\Users\\Jasmine\\MCP-Activity";

function safePath(userPath) {
  const resolved = path.resolve(ROOT, userPath);
  if (!resolved.startsWith(ROOT)) {
    throw new Error("Path escape detected!");
  }
  return resolved;
}

const server = new Server({
  name: "filesystem-mcp",
  description: "Simple MCP server with file operations",
});

// List files
server.method("listFiles", async ({ params }) => {
  const userPath = params?.path || ".";
  const safe = safePath(userPath);
  const files = fs.readdirSync(safe);
  return { files };
});

// Read file
server.method("readFile", async ({ params }) => {
  const fileName = params?.file;
  const filePath = safePath(fileName);
  const content = fs.readFileSync(filePath, "utf8");
  return { content };
});

// Write file
server.method("writeFile", async ({ params }) => {
  const fileName = params?.file;
  const content = params?.content || "";
  if (content.includes("<script>")) throw new Error("Unsafe content detected!");
  const filePath = safePath(fileName);
  fs.writeFileSync(filePath, content, "utf8");
  return { success: true };
});

// Delete file
server.method("deleteFile", async ({ params }) => {
  const fileName = params?.file;
  const filePath = safePath(fileName);
  fs.unlinkSync(filePath);
  return { success: true };
});

server.start();
