import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const possiblePathsURL: string[] = [
      '/calendar-events',
      '/tags',
      '/users',
    ];

    return `Hello! These are the possible paths: ${possiblePathsURL.join('\n')}`;
  }
}
