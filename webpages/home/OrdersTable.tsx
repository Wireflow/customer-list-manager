import OrdersList from '@/components/features/orders/OrdersList'
import { usePaginatedOrders } from '@/hooks/queries/orders/usePaginatedOrders'
import React from 'react'

type Props = {}

const OrdersTable = (props: Props) => {
    const {orders} = usePaginatedOrders({pageSize: 10, status: "pending"})
  return (
    <OrdersList orders={orders ?? []} />
  )
}

export default OrdersTable