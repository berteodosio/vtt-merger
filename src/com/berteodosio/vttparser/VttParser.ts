import { parse } from './ParserHelper';
import { printer } from './printer/Printer';
import { readFile } from './reader/FileReader';
import { createFile } from './writer/Writer';

export class VttParser {
  
  public async run() {
    console.log('VttParser run');
    printer.newSection('Beginning');

    const fileInfo = await readFile();
    const parsed = parse(true, fileInfo.content);
    const resultFileName = fileInfo.path.
      replace('.vtt', '_parsed.vtt').
      replace('.txt', '_parsed.txt');
    
    console.log(parsed);
    printer.newSection('Writing File');
    createFile(resultFileName, parsed);
    console.log('end');
  }
  
}