
import { Clipboard } from '@capacitor/clipboard';

export class ClipboardService {
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await Clipboard.write({
        string: text
      });
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback pour le web
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (fallbackError) {
        console.error('Fallback clipboard failed:', fallbackError);
        return false;
      }
    }
  }

  static async readFromClipboard(): Promise<string> {
    try {
      const result = await Clipboard.read();
      return result.value || '';
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return '';
    }
  }
}
