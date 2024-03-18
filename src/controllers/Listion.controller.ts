import { Controller, Get,Post,Body } from '@nestjs/common';
import { ListionService } from '../services/listion.service';

@Controller('listion')
export class ListionController {
  constructor(private readonly listion: ListionService) {}

  @Get("/")
  getHello(): string {
    return this.listion.getHello();
  }
  
  @Get('price')
  async getXlmPrice(): Promise<{ price: number }> {
    const price = await this.listion.getCurrentPrice();
    return { price };
  }

  @Get('start')
  startListening() {
    this.listion.listenForTransactions();
    return { message: 'Listening started' };
  }
}
