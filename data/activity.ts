import {
  mockAuditLogs,
  type AuditLog,
} from "./sonsieInventory"

export {
  mockActivityFeed,
  mockAuditLogs,
  mockUsers,
  type ActivityFeed,
  type AuditLog,
  type User,
} from "./sonsieInventory"

import { sonsieAlerts } from "./sonsieActivity"

export const extendedAuditLogs: AuditLog[] = [
  ...mockAuditLogs,
  { id: '9', user: 'SonsieAdmin', action: 'Update', itemName: 'Aperol', oldValue: '11 bottles', newValue: '9 bottles', timestamp: '2026-04-25T08:45:00' },
  { id: '10', user: 'Floor Manager', action: 'Create', itemName: 'Private Event Prep Packet', oldValue: '-', newValue: 'Checklist opened', timestamp: '2026-04-25T08:05:00' },
  { id: '11', user: 'Event Captain', action: 'Update', itemName: 'Wine Glasses', oldValue: '108 each', newValue: '96 each', timestamp: '2026-04-24T23:20:00' },
  { id: '12', user: 'Floor Manager', action: 'Import', itemName: 'Dinner Forecast Review', oldValue: '-', newValue: '28 items recalculated', timestamp: '2026-04-24T17:45:00' },
  { id: '13', user: 'SonsieAdmin', action: 'Delete', itemName: 'Expired Burrata', oldValue: '2 each', newValue: '-', timestamp: '2026-04-24T16:15:00' },
  { id: '14', user: 'Event Captain', action: 'Update', itemName: 'Linen Napkins', oldValue: '420 each', newValue: '340 each', timestamp: '2026-04-25T07:30:00' },
  { id: '15', user: 'SonsieAdmin', action: 'Export', itemName: 'Weekend Vendor Review', oldValue: '-', newValue: 'sonsie-vendor-review.pdf', timestamp: '2026-04-24T18:30:00' },
]

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  item?: string
  timestamp: string
  timeRemaining?: string
}

export const alerts: Alert[] = sonsieAlerts
