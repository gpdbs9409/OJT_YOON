import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "인증 헤더가 없습니다.",
      message: "Authorization 헤더를 포함해주세요.",
    });
  }

  if (authHeader !== "yoon") {
    return res.status(403).json({
      error: "인증 실패",
      message: "올바른 인증 정보를 입력해주세요.",
    });
  }

  // 인증 성공 시 다음 미들웨어로 진행
  next();
};
