import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatCurrency, formatPhoneNumber } from "@/utils/utils";
import { Printer } from "lucide-react";
import Dialog from "@/components/shared-ui/Dialog";
import { useReactToPrint } from "react-to-print";
import { formatDateToString } from "@/lib/utils";

type Props = {
  orderId: string;
};

const PrintInvoice = ({ orderId }: Props) => {
  const { data: order, isLoading, error } = useOrderById(orderId);
  const componentRef = useRef(null);
  const [itemsPerPage] = useState(16); // Adjust this number based on your needs

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice - Order ${order?.orderNumber}`,
    pageStyle: `
      @page {
        size: auto;
        margin: 0mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .page-break {
          page-break-before: always;
        }
      }
    `,
  });

  const InvoiceContent = () => {
    if (!order) return null;

    const totalPages = Math.ceil(order.orderItems.length / itemsPerPage);

    return (
      <div className="p-8 max-w-[210mm] mx-auto bg-white text-black">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div key={pageIndex} className={pageIndex > 0 ? "page-break" : ""}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Invoice</h2>
              <p>
                <strong>Order Number:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {formatDateToString(new Date(order.createdAt), {
                  hour: undefined,
                  minute: undefined,
                })}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {formatPhoneNumber(order.account.phoneNumber)}
              </p>
              <p>
                <strong>Page:</strong> {pageIndex + 1} of {totalPages}
              </p>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems
                  .slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  )
                  .map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2">{item.name}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-right py-2">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              {pageIndex === totalPages - 1 && (
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={3} className="text-right py-2">
                      Total:
                    </td>
                    <td className="text-right py-2">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <Button disabled>Loading...</Button>;
  if (error) return <Button disabled>Error loading order</Button>;
  if (!order) return <Button disabled>No order data</Button>;

  return (
    <Dialog
      trigger={
        <Button className="w-full flex-1">
          <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
      }
      className="p-0"
      content={
        <div className="max-h-[500px] overflow-auto no-scrollbar">
          <div ref={componentRef}>
            <InvoiceContent />
          </div>
        </div>
      }
      footer={
        <Button onClick={() => handlePrint()} className="mt-4 m-6" size="lg">
          Print
        </Button>
      }
    />
  );
};

export default PrintInvoice;
