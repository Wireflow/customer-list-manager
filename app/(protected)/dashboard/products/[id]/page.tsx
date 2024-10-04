import ProductDetailsPage from '@/webpages/products/ProductDetailsPage'
import React from 'react'

type Props = {
    params: {
        id: string
    }
}

const page = ({ params }: Props) => {
    const {id} = params
  return (
    <ProductDetailsPage id={id} />
  )
}

export default page