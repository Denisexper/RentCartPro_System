import { DailySummaryReport, ReceivableItem } from "../../types/report/report.types"

export interface ReportRepositoryInterface {
  getDailySummary(date: string, tenantId?: string): Promise<DailySummaryReport>
  getReceivables(tenantId?: string): Promise<ReceivableItem[]>
}
