import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: unknown, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res: Response, data: unknown, message = 'Created') {
    return this.success(res, data, message, 201);
  }

  static paginated(
    res: Response,
    items: unknown[],
    total: number,
    page: number,
    limit: number,
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  }
}
