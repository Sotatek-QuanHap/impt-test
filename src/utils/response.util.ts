import type { ValidationError } from '@nestjs/common';

/* eslint-disable  @typescript-eslint/no-explicit-any*/
interface INormalResponse<T> {
  code: number;
  data: T;
  message: string | string[];
  status: string;
  meta: any;
}

export class ResponseUtils {
  public static buildSuccessResponse(
    data: any,
    meta?: any,
  ): INormalResponse<any> {
    return {
      code: 1,
      message: '',
      data: JSON.parse(
        JSON.stringify(data, (key, value) =>
          typeof value === 'bigint' ? Number(value) : value,
        ),
      ),
      status: 'success',
      meta,
    };
  }

  public static buildCustomResponse(
    code: number,
    data: any,
    message: string | string[],
    meta?: any,
  ): INormalResponse<any> {
    return {
      code,
      message,
      data,
      status: code ? 'success' : 'fail',
      meta,
    };
  }

  public static handleClassValidatorResponse(
    error: ValidationError,
    parent?: string,
  ): string[] {
    if (error.constraints) {
      return Object.values(error.constraints).map((message) =>
        parent ? `${parent}.${message}` : message,
      );
    }

    if (error.children && error.children.length > 0) {
      return error.children.flatMap((child) =>
        this.handleClassValidatorResponse(
          child,
          parent ? `${parent}.${error.property}` : error.property,
        ),
      );
    }

    return [];
  }
}
