import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle } from 'lucide-react'
import type { Order } from '../../data/mockData'

interface OrdersTimelineProps {
  orders: Order[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'processing': return <Package className="w-5 h-5" />
    case 'shipped': return <Truck className="w-5 h-5" />
    case 'delivered': return <CheckCircle className="w-5 h-5" />
    default: return <Package className="w-5 h-5" />
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'processing': return 'قيد التجهيز'
    case 'shipped': return 'تم الشحن'
    case 'delivered': return 'تم التوصيل'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'processing': return 'bg-amber-100 text-amber-700'
    case 'shipped': return 'bg-blue-100 text-blue-700'
    case 'delivered': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function OrdersTimeline({ orders }: OrdersTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50"
    >
      <h3 className="font-bold text-text-dark text-lg mb-4">طلباتي</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ y: -4 }}
            className="flex-shrink-0 w-72 bg-white/50 rounded-2xl p-4 border border-white/30 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
              <span className="text-text-light text-sm font-medium">{order.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-amber-300/20 rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-secondary/60" />
              </div>
              <div className="flex-1">
                <p className="text-text-dark font-medium text-sm">{order.items} منتجات</p>
                <p className="text-secondary font-bold text-lg">{order.total} ₪</p>
              </div>
            </div>
            <p className="text-text-light text-xs mt-3 text-right">{order.date}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default OrdersTimeline
