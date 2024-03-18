import { Controller, Get, HttpCode,Post,Req,Res } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @HttpCode(200)
  getHello(): string {
    return this.appService.getHello();
  }
}
