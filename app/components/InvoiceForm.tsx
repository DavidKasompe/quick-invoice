"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyEmail: string;
  billTo: string;
  items: InvoiceItem[];
  notes: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    color: "#1a1a1a",
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  invoiceNumber: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    gap: 40,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  value: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  billTo: {
    marginTop: 30,
    marginBottom: 30,
  },
  billToLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  billToValue: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },
  table: {
    marginTop: 30,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  description: {
    flex: 4,
    fontSize: 14,
    color: "#111827",
    paddingRight: 8,
    fontFamily: "Helvetica",
  },
  quantity: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    fontFamily: "Helvetica",
  },
  rate: {
    flex: 2,
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    paddingRight: 8,
    fontFamily: "Helvetica",
  },
  amount: {
    flex: 2,
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    fontFamily: "Helvetica",
  },
  tableHeaderText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Helvetica-Bold",
  },
  totalsSection: {
    marginTop: 20,
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginRight: 40,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    width: 100,
    textAlign: "right",
  },
  notes: {
    marginTop: 40,
    paddingTop: 20,
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
  },
  notesLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  notesValue: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 10,
    paddingTop: 10,
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    fontFamily: "Helvetica",
  },
});

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const items = data.items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) || 0,
    rate: Number(item.rate) || 0,
  }));

  const total = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>

        {/* Company and Invoice Info Grid */}
        <View style={styles.grid}>
          <View style={styles.col}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>
              {data.companyName || "Company Name"}
            </Text>
            <Text style={styles.value}>
              {data.companyEmail || "company@example.com"}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Date Issued</Text>
            <Text style={styles.value}>{data.date}</Text>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{data.dueDate}</Text>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>Bill To</Text>
          <Text style={styles.billToValue}>
            {data.billTo || "Client Details"}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.description, styles.tableHeaderText]}>
              Description
            </Text>
            <Text style={[styles.quantity, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.rate, styles.tableHeaderText]}>Rate</Text>
            <Text style={[styles.amount, styles.tableHeaderText]}>Amount</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.description}>{item.description || "-"}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.rate}>{formatCurrency(item.rate)}</Text>
              <Text style={styles.amount}>
                {formatCurrency(item.quantity * item.rate)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Notes Section */}
        {data.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesValue}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
};

// Updated background style with a more subtle and professional gradient
const pageBackground = {
  background: "linear-gradient(135deg, #f6f8fd 0%, #f0f3fa 100%)",
  backgroundImage: `
    radial-gradient(at 40% 20%, rgba(147, 51, 234, 0.05) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(49, 46, 129, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(147, 51, 234, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(49, 46, 129, 0.05) 0px, transparent 50%),
    radial-gradient(at 80% 100%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 0%, rgba(147, 51, 234, 0.05) 0px, transparent 50%)
  `,
};

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `INV-${year}${month}${day}-${hours}${minutes}`;
};

const generateFileName = (invoiceNumber: string) => {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  return `invoice-${invoiceNumber || formattedDate}`;
};

export default function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);
  const { register, handleSubmit, watch, setValue } = useForm<InvoiceData>({
    defaultValues: {
      items: [{ description: "", quantity: 1, rate: 0 }],
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      invoiceNumber: generateInvoiceNumber(),
    },
  });
  const formData = watch();

  const addItem = () => {
    const newItems = [...items, { description: "", quantity: 1, rate: 0 }];
    setItems(newItems);
    setValue("items", newItems);
  };

  const handleNumberInput = (
    index: number,
    field: "quantity" | "rate",
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: numValue };
    setItems(newItems);
    setValue(`items.${index}.${field}`, numValue);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="h-full max-w-[1400px] mx-auto flex flex-col p-4">
        {/* Compact Header Section */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-gray-900">Quick Invoice</h1>
          <p className="text-sm text-gray-600">
            Create beautiful, professional invoices in seconds
          </p>
        </div>

        <div className="flex flex-row gap-4 h-[calc(100vh-6rem)] overflow-hidden">
          {/* Form Section */}
          <div className="w-1/2 overflow-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-white px-4 py-2 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Invoice Details
              </h2>
            </div>

            <form className="p-4 space-y-4">
              {/* Company Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Your Company
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      {...register("companyName")}
                      className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("companyEmail")}
                      className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                      placeholder="company@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Invoice Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      {...register("invoiceNumber")}
                      className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      {...register("date")}
                      className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  />
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Client Details
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Bill To
                  </label>
                  <textarea
                    {...register("billTo")}
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                    placeholder="Client's billing information..."
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Item
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-100 border-b border-gray-200">
                    <div className="col-span-6 text-xs font-medium text-gray-600">
                      Description
                    </div>
                    <div className="col-span-3 text-xs font-medium text-gray-600">
                      Quantity
                    </div>
                    <div className="col-span-3 text-xs font-medium text-gray-600">
                      Rate ($)
                    </div>
                  </div>

                  <div className="p-2 space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3">
                        <div className="col-span-6">
                          <input
                            type="text"
                            {...register(`items.${index}.description`)}
                            className="w-full px-2 py-1 rounded-lg bg-white border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              handleNumberInput(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 rounded-lg bg-white border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                            placeholder="Qty"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              handleNumberInput(index, "rate", e.target.value)
                            }
                            className="w-full px-2 py-1 rounded-lg bg-white border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  placeholder="Additional notes or terms..."
                />
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="w-1/2 flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="h-full bg-white rounded-lg shadow-inner border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">INVOICE</h3>
                  <p className="text-sm text-gray-600">
                    #{formData.invoiceNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Date Issued
                    </p>
                    <p className="text-sm text-gray-900">{formData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-900">{formData.dueDate}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Bill To
                  </p>
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {formData.billTo}
                  </p>
                </div>

                <table className="w-full mb-6 text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-medium text-gray-600">
                        Description
                      </th>
                      <th className="text-right py-2 text-xs font-medium text-gray-600">
                        Qty
                      </th>
                      <th className="text-right py-2 text-xs font-medium text-gray-600">
                        Rate
                      </th>
                      <th className="text-right py-2 text-xs font-medium text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-900">
                          {item.description}
                        </td>
                        <td className="py-1.5 text-right text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-1.5 text-right text-gray-900">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="py-1.5 text-right text-gray-900">
                          {formatCurrency(item.quantity * item.rate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-6">
                  <div className="w-1/2">
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-600">
                        Total
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(
                          items.reduce(
                            (sum, item) => sum + item.quantity * item.rate,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-gray-900">{formData.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              {typeof window !== "undefined" && (
                <PDFDownloadLink
                  document={<InvoicePDF data={formData} />}
                  fileName={`${generateFileName(formData.invoiceNumber)}.pdf`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {({ loading, error }) =>
                    loading ? (
                      <span className="inline-flex items-center">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Preparing Download...
                      </span>
                    ) : error ? (
                      <span className="inline-flex items-center">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Error generating PDF
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Download Invoice
                      </span>
                    )
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
