import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('test')
  test(): { status: string; message: string } {
    return { status: 'ok', message: 'Test endpoint working' };
  }
}
