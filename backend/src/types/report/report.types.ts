export interface DailySummaryByMethod {
  method: string
  total: number
  count: number
}

export interface DailySummaryByType {
  type: string
  total: number
  count: number
}

export interface DailySummaryReport {
  date: string
  totalIngresos: number
  totalTransacciones: number
  byMethod: DailySummaryByMethod[]
  byType: DailySummaryByType[]
}

export interface ReceivableItem {
  rentalId: string
  clientName: string
  vehiclePlate: string
  vehicleBrand: string
  vehicleModel: string
  startDate: Date
  endDate: Date
  totalAmount: number
  totalPagado: number
  saldoPendiente: number
  diasVencido: number
}
