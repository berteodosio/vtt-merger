import * as fs from 'fs';
import * as path from 'path';

// Function to create a file with the given content
export function createFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);

  // Create directories if they do not exist
  fs.mkdirSync(dir, { recursive: true });

  // Write the content to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`File created at ${filePath}`);
}