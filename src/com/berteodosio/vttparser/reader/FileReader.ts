import * as fs from 'fs';
import * as readline from 'readline';

function readFileToString(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function askFilePath(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter the file path: ', (filePath) => {
      rl.close();
      resolve(filePath);
    });
  });
}

// Main function to handle the process
type FileInfo = {
  path: string;
  content: string;
};

export async function readFile(): Promise<FileInfo> {
  try {
    const filePath = await askFilePath();
    const content = await readFileToString(filePath);
    return { path: filePath, content: content };
  } catch (error) {
    console.error('Error reading file:', error);
    return { path: '', content: `Can't read file` };
  }
}
