import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class Tokens_validations implements ValidatorConstraintInterface {
    validate(token: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): "sourceToken must be either USDT or USDC for Ethereum walletType." | "destinationToken must be either USDC or aeETH for Ethereum walletType." | "sourceToken must be either USDT or BNB for BNB walletType." | "destinationToken must be either BNB or aeETH for BNB walletType." | "Invalid token.";
}
