/**
 * Represents a font available in the system.
 */
export interface Font {
  /**
   * The name of the font.
   */
  name: string;
  /**
   * The path to the font file.
   */
  path: string;
}

/**
 * Asynchronously retrieves a list of fonts installed on the system.
 *
 * @returns A promise that resolves to an array of Font objects.
 */
export async function getSystemFonts(): Promise<Font[]> {
  // TODO: Implement this by calling an API to fetch system fonts.

  return [
    {
      name: 'Arial',
      path: '/path/to/arial.ttf',
    },
    {
      name: 'Times New Roman',
      path: '/path/to/times.ttf',
    },
    {
      name: 'Roboto',
      path: '/path/to/roboto.ttf',
    },
    {
      name: 'Open Sans',
      path: '/path/to/open-sans.ttf',
    },
  ];
}

