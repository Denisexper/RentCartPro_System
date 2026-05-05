import { PrismaClient } from "@prisma/client"
import { ReportRepositoryInterface } from "../../interfaces/report/report.repository.interface"
import { DailySummaryReport, ReceivableItem } from "../../types/report/report.types"

const RENTAL_PAYMENT_TYPES = ["Deposito", "PagoAlquiler"] as const

export class ReportRepository implements ReportRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async getDailySummary(date: string, tenantId?: string): Promise<DailySummaryReport> {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const pagos = await this.prisma.payment.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...(tenantId ? { rental: { tenantId } } : {}),
      },
    })

    const byMethod = new Map<string, { total: number; count: number }>()
    const byType = new Map<string, { total: number; count: number }>()
    let totalIngresos = 0

    for (const p of pagos) {
      const amount = Number(p.amount)
      totalIngresos += amount

      const m = byMethod.get(p.method) ?? { total: 0, count: 0 }
      byMethod.set(p.method, { total: m.total + amount, count: m.count + 1 })

      const t = byType.get(p.type) ?? { total: 0, count: 0 }
      byType.set(p.type, { total: t.total + amount, count: t.count + 1 })
    }

    return {
      date,
      totalIngresos,
      totalTransacciones: pagos.length,
      byMethod: Array.from(byMethod.entries()).map(([method, v]) => ({ method, ...v })),
      byType: Array.from(byType.entries()).map(([type, v]) => ({ type, ...v })),
    }
  }

  async getReceivables(tenantId?: string): Promise<ReceivableItem[]> {
    const rentals = await this.prisma.rental.findMany({
      where: {
        status: "Active",
        ...(tenantId ? { tenantId } : {}),
      },
      include: {
        client: true,
        vehicle: true,
        payments: {
          where: { type: { in: [...RENTAL_PAYMENT_TYPES] } },
        },
      },
      orderBy: { endDate: "asc" },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const result: ReceivableItem[] = []

    for (const r of rentals) {
      const totalPagado = r.payments.reduce((sum, p) => sum + Number(p.amount), 0)
      const totalAmount = Number(r.totalAmount)
      const saldoPendiente = Math.max(0, totalAmount - totalPagado)

      if (saldoPendiente <= 0) continue

      const endDate = new Date(r.endDate)
      endDate.setHours(0, 0, 0, 0)
      const diasVencido = Math.max(0, Math.floor((today.getTime() - endDate.getTime()) / 86_400_000))

      result.push({
        rentalId: r.id,
        clientName: `${r.client.firstName} ${r.client.lastName}`,
        vehiclePlate: r.vehicle.plate,
        vehicleBrand: r.vehicle.brand,
        vehicleModel: r.vehicle.model,
        startDate: r.startDate,
        endDate: r.endDate,
        totalAmount,
        totalPagado,
        saldoPendiente,
        diasVencido,
      })
    }

    return result
  }
}
