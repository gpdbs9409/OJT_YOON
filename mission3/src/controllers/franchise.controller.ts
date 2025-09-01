import type { Request, Response } from "express";
const { api_data } = require("../repository/mongoose");

//read 함수 정의
class FranchiseController {
  async getAllFranchises(req: Request, res: Response) {
    const { registerNumber } = req.params; // 확장성 고려하여 registernumber( 회사코드) 파라미터로 받음
    const franchise = await api_data.find({}); //현재 db에 명륜진사갈비 데이터 밖에 없기에 Find에 조건 없음 (전제데이터조회)

    res.send(franchise);
  }

  async createFranchise(req: Request, res: Response) {
    const { name, addr, tel } = req.body;
    const franchise = await api_data.create({ name, addr, tel });
    res.send(franchise);
  }

  async updateFranchise(req: Request, res: Response) {
    const { id } = req.params;
    const { name, addr, tel } = req.body;
    const franchise = await api_data.findByIdAndUpdate(id, { name, addr, tel });
    res.send(franchise);
  }

  async deleteFranchise(req: Request, res: Response) {
    const { id } = req.params;
    const franchise = await api_data.findByIdAndDelete(id);
    res.send(franchise);
  }
}

module.exports = { FranchiseController };
