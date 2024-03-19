export declare class ListionService {
    private readonly logger;
    constructor();
    getHello(): string;
    getCurrentPrice(): Promise<number>;
    listenForTransactions(): void;
}
