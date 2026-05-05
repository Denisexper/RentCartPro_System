import { Request, Response } from "express"
import { ReportRepositoryInterface } from "../../interfaces/report/report.repository.interface"

export class ReportControllerService {
  constructor(private readonly repository: ReportRepositoryInterface) {}

  async getDailySummary(req: Request, res: Response) {
    const isSuperAdmin = req.user!.role === "SuperAdmin"
    const tenantId = isSuperAdmin
      ? (req.query.tenantId as string | undefined)
      : req.user!.tenantId!

    const date = (req.query.date as string) ?? new Date().toISOString().split("T")[0]

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ msj: "Formato de fecha inválido. Use YYYY-MM-DD." })
    }

    try {
      const data = await this.repository.getDailySummary(date, tenantId)
      return res.status(200).json({ msj: "Daily summary retrieved", data })
    } catch (error: any) {
      console.error("[ReportController] Error en getDailySummary():", error)
      return res.status(500).json({ msj: "Server error", error: error.message })
    }
  }

  async getReceivables(req: Request, res: Response) {
    const isSuperAdmin = req.user!.role === "SuperAdmin"
    const tenantId = isSuperAdmin
      ? (req.query.tenantId as string | undefined)
      : req.user!.tenantId!

    try {
      const data = await this.repository.getReceivables(tenantId)
      return res.status(200).json({ msj: "Receivables retrieved", data })
    } catch (error: any) {
      console.error("[ReportController] Error en getReceivables():", error)
      return res.status(500).json({ msj: "Server error", error: error.message })
    }
  }
}
