import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ObjectIdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
