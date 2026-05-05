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

export interface DailyMovement {
  id: string
  type: string
  method: string
  amount: number
  notes: string | null
  createdAt: Date
  clientName: string
  vehiclePlate: string
}

export interface DailySummaryReport {
  date: string
  totalIngresos: number
  totalTransacciones: number
  byMethod: DailySummaryByMethod[]
  byType: DailySummaryByType[]
  movimientos: DailyMovement[]
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
