import type { Request, Response } from 'express';
const Franchise = require('../../models/branches_from_api');

class FranchiseController {
  /**
   * 프랜차이즈 전체 목록 조회
   */
  static async getAllFranchises(req: Request, res: Response) {
    try {
      const items = await Franchise.find().sort({ _id: -1 }).lean();
      res.json(items);
    } catch (error) {
      console.error('프랜차이즈 목록 조회 실패:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }



  /**
   * 프랜차이즈 생성
   */
  static async createFranchise(req: Request, res: Response) {
    try {
      const doc = await Franchise.create(req.body);
      res.status(201).json({
        message: '프랜차이즈가 성공적으로 생성되었습니다.',
        data: doc
      });
    } catch (error) {
      console.error('프랜차이즈 생성 실패:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 프랜차이즈 정보 수정
   */
  static async updateFranchise(req: Request, res: Response) {
    try {
      const doc = await Franchise.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        {
          new: true,
          runValidators: true,
        }
      ).lean();
      
      if (!doc) {
        return res.status(404).json({ 
          error: "프랜차이즈를 찾을 수 없습니다.",
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        message: '프랜차이즈가 성공적으로 수정되었습니다.',
        data: doc
      });
    } catch (error) {
      console.error('프랜차이즈 수정 실패:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 프랜차이즈 삭제
   */
  static async deleteFranchise(req: Request, res: Response) {
    try {
      const result = await Franchise.deleteOne({ _id: req.params.id });
      
      if (!result.deletedCount) {
        return res.status(404).json({ 
          error: "프랜차이즈를 찾을 수 없습니다.",
          deletedCount: result.deletedCount,
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(200).json({ 
        message: "프랜차이즈가 성공적으로 삭제되었습니다.",
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('프랜차이즈 삭제 실패:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = { FranchiseController };
