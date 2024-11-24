import { Component } from '@angular/core';
import { ThemeService } from 'app/shared/services/theme.service';
import { STORAGE_KEYS } from 'app/shared/static/local-storage-keys';

@Component({
  selector: 'app-curl-to-python',
  templateUrl: './curl-to-python.component.html',
  styleUrls: ['./curl-to-python.component.scss'],
})
export class CurlToPythonComponent {
  leftText = '';
  rightText = '';

  leftWidth = 50;
  rightWidth = 50;
  isResizing = false;

  startX = 0;
  startWidth = 50;

  codeEditorOptionsInput = {
    theme: 'vs-light',
    language: 'curl',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
  };

  codeEditorOptionsOutput = {
    theme: 'vs-light',
    language: 'python',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
  };

  constructor(private themeService: ThemeService) {
    this.codeEditorOptionsInput.theme = this.themeService.getVsTheme();
    this.codeEditorOptionsOutput.theme = this.themeService.getVsTheme();

    this.themeService.getChangingThemeSubject().subscribe(() => {
      this.codeEditorOptionsInput = {
        ...this.codeEditorOptionsInput,
        theme: this.themeService.getVsTheme(),
      };
      this.codeEditorOptionsOutput = {
        ...this.codeEditorOptionsOutput,
        theme: this.themeService.getVsTheme(),
      };
    });

    this.leftWidth =
      (localStorage.getItem(STORAGE_KEYS.encoding.leftWidth) as
        | number
        | null) || 50;
    this.rightWidth = 100 - this.leftWidth;
  }

  convertCurlToPython() {
    if (!this.leftText) {
      this.rightText = 'Please enter a valid CURL command.';
      return;
    }

    const pythonScript = this.parseCurlToPython(this.leftText);
    this.rightText = pythonScript || 'Could not parse the CURL command.';
  }
  parseCurlToPython(curl: string): string {
    try {
      curl = curl.replace(/^\s*curl\s+/, '');

      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';

      const chars = curl.replace(/\\\n/g, ' ').split('');

      for (const char of chars) {
        if ((char === '"' || char === "'") && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
          continue;
        }
        if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
          continue;
        }
        if (char === ' ' && !inQuotes) {
          if (current) {
            parts.push(current);
            current = '';
          }
          continue;
        }
        current += char;
      }
      if (current) {
        parts.push(current);
      }

      let url = '';
      const headers: { [key: string]: string } = {};
      const cookies: { [key: string]: string } = {};
      let data: any = {};
      let method = 'get';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part.startsWith('http://') || part.startsWith('https://')) {
          url = part.replace(/["']/g, '');
          continue;
        }

        switch (part) {
          case '-X':
          case '--request':
            if (i + 1 < parts.length) {
              method = parts[++i].toLowerCase();
            }
            break;

          case '-H':
          case '--header':
            if (i + 1 < parts.length) {
              const headerPart = parts[++i];
              const colonIndex = headerPart.indexOf(':');
              if (colonIndex !== -1) {
                const key = headerPart.slice(0, colonIndex).trim();
                const value = headerPart
                  .slice(colonIndex + 1)
                  .trim()
                  .replace(/["']/g, '');
                if (key.toLowerCase() === 'cookie') {
                  const cookiePairs = value.split(';');
                  cookiePairs.forEach((pair) => {
                    const [cookieKey, cookieValue] = pair.trim().split('=');
                    if (cookieKey && cookieValue) {
                      cookies[cookieKey] = cookieValue;
                    }
                  });
                } else {
                  headers[key] = value;
                }
              }
            }
            break;

          case '-b':
          case '--cookie':
            if (i + 1 < parts.length) {
              const cookiePart = parts[++i].replace(/["']/g, '');
              const cookiePairs = cookiePart.split(';');
              cookiePairs.forEach((pair) => {
                const [key, value] = pair.trim().split('=');
                if (key && value) {
                  cookies[key] = value;
                }
              });
            }
            break;

          case '-d':
          case '--data':
          case '--data-raw':
            if (i + 1 < parts.length) {
              try {
                const dataStr = parts[++i].replace(/^['"]|['"]$/g, '');
                data = JSON.parse(dataStr);
              } catch (e) {
                data = parts[i];
              }
            }
            break;
        }
      }

      let pythonCode = `
import requests

url = "${url}"
`;

      if (Object.keys(headers).length) {
        pythonCode += `headers = ${JSON.stringify(headers, null, 4)}\n`;
      }

      if (Object.keys(cookies).length) {
        pythonCode += `cookies = ${JSON.stringify(cookies, null, 4)}\n`;
      }

      if (Object.keys(data).length) {
        pythonCode += `data = ${JSON.stringify(data, null, 4)}\n`;
      }

      const requestParams = ['url'];
      if (Object.keys(headers).length) requestParams.push('headers=headers');
      if (Object.keys(cookies).length) requestParams.push('cookies=cookies');
      if (Object.keys(data).length) requestParams.push('json=data');

      pythonCode += `
response = requests.${method}(${requestParams.join(', ')})
`;

      return pythonCode.trim();
    } catch (error: any) {
      console.error('Error parsing CURL command:', error);
      throw new Error(`Failed to parse CURL command: ${error.message}`);
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = (
      document.querySelector('.left') as HTMLElement
    ).offsetWidth;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;

    const containerWidth = (
      document.querySelector('.right-left-container') as HTMLElement
    ).offsetWidth;
    const moveX = event.clientX - this.startX;
    this.leftWidth = ((this.startWidth + moveX) / containerWidth) * 100;
    this.rightWidth = 100 - this.leftWidth;
  };

  onMouseUp = (): void => {
    if (this.isResizing) {
      this.isResizing = false;

      localStorage.setItem(
        STORAGE_KEYS.encoding.leftWidth,
        this.leftWidth.toString()
      );

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  };
}
