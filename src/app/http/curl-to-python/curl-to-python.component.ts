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
      const lines = curl.split('\\\n').join(' ').split(' ');
      const url = lines.find((line) => line.startsWith('http')) || '';
      const headers: { [key: string]: string } = {};
      const data: { [key: string]: any } = {};
      let method = 'get';

      // Parse through the CURL lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '-X') {
          method = lines[i + 1].toLowerCase();
          i++;
        } else if (line === '-H') {
          const [key, value] = lines[i + 1].split(':').map((s) => s.trim());
          headers[key] = value;
          i++;
        } else if (line === '-d' || line === '--data') {
          const body = lines[i + 1];
          Object.assign(data, JSON.parse(body));
          i++;
        }
      }

      // Create the Python script
      const rightText = `
import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 4)}
data = ${JSON.stringify(data, null, 4)}

response = requests.${method}(url, headers=headers, json=data)
print(response.json())
      `;
      return rightText.trim();
    } catch (error) {
      console.error('Error parsing CURL command:', error);
      return '';
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
