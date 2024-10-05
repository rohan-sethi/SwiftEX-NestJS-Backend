import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ async: false })
export class validations_token implements ValidatorConstraintInterface {
  validate(token: string, args: ValidationArguments) {
    const walletType = (args.object as any).walletType;

    if (walletType === 'Ethereum') {
      const allowedSourceTokens = ['USDT', 'USDC'];
      const allowedDestinationTokens = ['USDC', 'aeETH'];

      if (args.property === 'sourceToken') {
        return allowedSourceTokens.includes(token);
      }

      if (args.property === 'destinationToken') {
        return allowedDestinationTokens.includes(token);
      }
    }

    if (walletType === 'BNB') {
      const allowedSourceTokens = ['USDT', 'BNB'];
      const allowedDestinationTokens = ['BNB', 'aeETH'];

      if (args.property === 'sourceToken') {
        return allowedSourceTokens.includes(token);
      }

      if (args.property === 'destinationToken') {
        return allowedDestinationTokens.includes(token);
      }
    }
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const walletType = (args.object as any).walletType;
    if (walletType === 'Ethereum') {
      if (args.property === 'sourceToken') {
        return `sourceToken must be either USDT or USDC for Ethereum walletType.`;
      }
      if (args.property === 'destinationToken') {
        return `destinationToken must be either USDC or aeETH for Ethereum walletType.`;
      }
    }
    if (walletType === 'BNB') {
      if (args.property === 'sourceToken') {
        return `sourceToken must be either USDT or BNB for BNB walletType.`;
      }
      if (args.property === 'destinationToken') {
        return `destinationToken must be either BNB or aeETH for BNB walletType.`;
      }
    }
    return `Invalid token.`;
  }

  
}
export function IsValidToken(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validations_token,
    });
  };
}
