import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonFormatService {
  public jsonFormat(text: string): string {
    let modifiedJson = JSON.parse(text);
    modifiedJson = this.sortObjectKeys(modifiedJson);
    return JSON.stringify(modifiedJson, null, 2);
  }

  private sortObjectKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.sortObjectKeys);
    }

    const sortedKeys = Object.keys(obj).sort();
    const result: any = {};
    for (const key of sortedKeys) {
      result[key] = this.sortObjectKeys(obj[key]);
    }
    return result;
  }
}
