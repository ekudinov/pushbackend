import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  mainPage(): string {
    return 'Welcome!';
  }

  @Get('/api')
  apiPage(): string {
    return '<a href="/api/docs">Go to doc</a>';
  }

}
