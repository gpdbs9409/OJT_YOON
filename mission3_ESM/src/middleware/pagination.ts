import { Request, Response, NextFunction } from "express";

export const validatePaginationParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = parseInt(req.query.limit as string) || 10;

  // 유효성 검증
  if (limit < 1 || limit > 100) {
    return res.status(400).json({ error: "Limit must be between 1 and 100" });
  }

  const validatedParams = { limit };
  (req as any).validatedParams = validatedParams;
  next(); //next 함수 호출로 다음 라우터로 이동 가능하게 함.
};
