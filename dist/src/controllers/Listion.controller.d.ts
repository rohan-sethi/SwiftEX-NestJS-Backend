import { ListionService } from '../services/listion.service';
export declare class ListionController {
    private readonly listion;
    constructor(listion: ListionService);
    getHello(): string;
    getXlmPrice(): Promise<{
        price: number;
    }>;
    startListening(): {
        message: string;
    };
}
