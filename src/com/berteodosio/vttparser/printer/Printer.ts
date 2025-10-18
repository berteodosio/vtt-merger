class Printer {
  public newSection(sectionTitle: string): void {
    console.log(`${sectionTitle}`);
    console.log(`============================\n`);
  }
}

export const printer = new Printer();