import OrderDetailsPage from "@/webpages/orders/OrderDetailsPage";

type Props = {
  params: {
    id: string;
  };
};

const OrderDetails = ({ params: { id } }: Props) => {
  return (
    <div>
      <OrderDetailsPage id={id} />
    </div>
  );
};

export default OrderDetails;
