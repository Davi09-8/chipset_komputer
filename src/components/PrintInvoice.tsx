'use client';

export default function PrintInvoice({ order }: { order: any }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <button
                onClick={handlePrint}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 print:hidden"
            >
                🖨️ Print Invoice
            </button>

            {/* Print-only styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    @page {
                        margin: 2cm;
                    }
                }
            `}</style>

            {/* Print area */}
            <div className="print-area hidden print:block">
                <div className="max-w-4xl mx-auto p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">INVOICE</h1>
                        <p className="text-gray-600">Chipset Computer</p>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <p className="font-semibold">Order Number:</p>
                            <p>{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date:</p>
                            <p>{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Payment Method:</p>
                            <p>{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status:</p>
                            <p>{order.status}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-2">Item</th>
                                <th className="text-center py-2">Qty</th>
                                <th className="text-right py-2">Price</th>
                                <th className="text-right py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item: any) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2">{item.product.name}</td>
                                    <td className="text-center py-2">{item.quantity}</td>
                                    <td className="text-right py-2">Rp {item.price.toLocaleString('id-ID')}</td>
                                    <td className="text-right py-2">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-300">
                                <td colSpan={3} className="text-right font-bold py-2">Total:</td>
                                <td className="text-right font-bold py-2">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        <p>Thank you for your purchase!</p>
                        <p>Chipset Computer - info@chipsetcomputer.com</p>
                    </div>
                </div>
            </div>
        </>
    );
}
