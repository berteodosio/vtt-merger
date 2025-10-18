interface VTTMessage {
  initialTimestamp: string;
  finalTimestamp: string;
  person: string;
  message: string;
}

interface ParsedVTT {
  header: Record<string, string>;
  messages: VTTMessage[];
}

function parseVTT(vttContent: string): ParsedVTT {
  const lines = vttContent.split('\n').map(line => line.trim());
  const header: Record<string, string> = {};
  const messages: VTTMessage[] = [];
  
  let i = 0;
  
  // Parse the header
  while (lines[i] && !lines[i].includes('-->')) {
    const [key, value] = lines[i].split(':').map(part => part.trim());
    if (key && value) {
      header[key] = value;
    }
    i++;
  }
  
  // Parse the content
  while (i < lines.length) {
    if (lines[i].includes('-->')) {
      const [initialTimestamp, finalTimestamp] = lines[i].split('-->').map(part => part.trim());
      i++;

      while (i < lines.length && !lines[i].includes('-->')) {
        const personMatch = lines[i].match(/\(([^)]+)\)/);
        if (personMatch) {
          const person = personMatch[1];
          let message = '';
          i++;

          while (i < lines.length && !lines[i].includes('-->') && !lines[i].match(/\(([^)]+)\)/)) {
            message += lines[i] + ' ';
            i++;
          }

          messages.push({
            initialTimestamp,
            finalTimestamp,
            person,
            message: message.trim()
          });
        } else {
          i++;
        }
      }
    } else {
      i++;
    }
  }
  
  return { header, messages };
}

function joinMessages(parsedVTT: ParsedVTT, includeTimestamps: boolean): string {
  const { messages } = parsedVTT;
  const output: string[] = [];
  
  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    let combinedMessage = current.message;
    
    while (i + 1 < messages.length && messages[i + 1].person === current.person) {
      combinedMessage += ' ' + messages[++i].message;
    }
    
    if (includeTimestamps) {
      output.push(`\n${current.initialTimestamp} --> ${current.finalTimestamp}`);
    }
    output.push(`(${current.person})`);
    output.push(combinedMessage);
  }
  
  return output.join('\n');
}

// Example usage
const vttContent = `WEBVTT
Kind: captions
Language: pt

00:00:00.000 --> 00:00:04.000
(John Marston)
Yes, I agree with you
  And I think we should proceed
00:00:04.000 --> 00:00:08.000
(John Marston)
Moreover, the strategy
is sound.
00:00:04.000 --> 00:00:08.000
(Jane Doe)
I see your point, John
However, we need
more data.
00:00:08.000 --> 00:00:12.000
(Jane Doe)
I understand.
  `;

export function parse(includeTimestamps: boolean, vttContent: string): string {
  const parsedVTT = parseVTT(vttContent);
  const result = joinMessages(parsedVTT, includeTimestamps); // Set to false to disable timestamps
  return result;
}

