import { useState } from "react";
import { Trash2, Plus, Printer } from "lucide-react";

interface InvoiceItem {
  id: number;
  hsCode: string;
  description: string;
  qty: number;
  uom: string;
  rate: number;
  amount: number;
}

const BUSINESS = {
  name: "DIPESH MOBILE CENTER",
  address: "Partima Chowk Birgunj",
  vat: "604057215",
} as const;

const generateInvoiceNo = () => {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `SB-${num}`;
};

const todayDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const Index = () => {
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNo());
  const [invoiceDate, setInvoiceDate] = useState(todayDate());
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [payMode, setPayMode] = useState("CASH");
  const [discount, setDiscount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, hsCode: "", description: "", qty: 1, uom: "PCS", rate: 0, amount: 0 },
  ]);

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "rate") {
          updated.amount = Number(updated.qty) * Number(updated.rate);
        }
        return updated;
      })
    );
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id: newId, hsCode: "", description: "", qty: 1, uom: "PCS", rate: 0, amount: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxable = subtotal - discount;
  const vat = taxable * 0.13;
  const netTotal = taxable + vat;

  const formatNum = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Action bar - hidden on print */}
      <div className="no-print mx-auto mb-6 flex max-w-4xl items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Invoice Generator</h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      {/* Invoice */}
      <div className="invoice-container mx-auto max-w-4xl rounded border border-invoice-border bg-card p-6 shadow-sm md:p-10">
        {/* Header */}
        <div className="mb-1 border-b-2 border-foreground pb-4 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Tax Invoice</p>
          <h2 className="mt-1 text-2xl font-bold uppercase tracking-wide text-foreground">
            {BUSINESS.name}
          </h2>
          <p className="text-sm text-muted-foreground">{BUSINESS.address}</p>
          <p className="text-sm text-muted-foreground">PAN NO: {BUSINESS.vat}</p>
        </div>

        {/* Party + Invoice info */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <span className="w-20 font-semibold text-foreground">PARTY</span>
              <span className="text-muted-foreground">:</span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="no-print-border flex-1 border-b border-dashed border-input bg-transparent px-1 text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
              <span className="print-only flex-1 text-foreground">{customerName}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 font-semibold text-foreground">ADDRESS</span>
              <span className="text-muted-foreground">:</span>
              <input
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Address / Contact"
                className="no-print-border flex-1 border-b border-dashed border-input bg-transparent px-1 text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <div className="flex gap-2">
              <span className="w-20 font-semibold text-foreground">VAT/PAN</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-foreground">{BUSINESS.vat}</span>
            </div>
          </div>
          <div className="space-y-1.5 text-sm md:text-right">
            <div className="flex justify-start gap-2 md:justify-end">
              <span className="font-semibold text-foreground">INVOICE NO</span>
              <span className="text-muted-foreground">:</span>
              <input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="no-print-border w-28 border-b border-dashed border-input bg-transparent px-1 text-right text-foreground outline-none focus:border-foreground"
              />
            </div>
            <div className="flex justify-start gap-2 md:justify-end">
              <span className="font-semibold text-foreground">INVOICE DATE</span>
              <span className="text-muted-foreground">:</span>
              <input
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="no-print-border w-28 border-b border-dashed border-input bg-transparent px-1 text-right text-foreground outline-none focus:border-foreground"
              />
            </div>
          </div>
        </div>

        {/* Pay Mode */}
        <div className="mt-4 text-center text-sm font-semibold text-foreground">
          PAY MODE : &nbsp;
          <select
            value={payMode}
            onChange={(e) => setPayMode(e.target.value)}
            className="no-print-border border-b border-dashed border-input bg-transparent text-foreground outline-none"
          >
            <option value="CASH">CASH</option>
            <option value="CHEQ">CHEQ</option>
            <option value="CREDIT">CREDIT</option>
          </select>
        </div>

        {/* Items Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-invoice-border text-sm">
            <thead>
              <tr className="bg-invoice-header-bg text-foreground">
                <th className="border border-invoice-border px-2 py-2 text-center w-10">SN</th>
                <th className="border border-invoice-border px-2 py-2 text-left w-24">H.S CODE</th>
                <th className="border border-invoice-border px-2 py-2 text-left">DESCRIPTION</th>
                <th className="border border-invoice-border px-2 py-2 text-center w-16">QTY</th>
                <th className="border border-invoice-border px-2 py-2 text-center w-16">UOM</th>
                <th className="border border-invoice-border px-2 py-2 text-right w-28">RATE</th>
                <th className="border border-invoice-border px-2 py-2 text-right w-28">AMOUNT</th>
                <th className="no-print border border-invoice-border px-2 py-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="text-foreground">
                  <td className="border border-invoice-border px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border border-invoice-border px-1 py-1">
                    <input
                      value={item.hsCode}
                      onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
                      className="w-full bg-transparent px-1 outline-none text-foreground"
                    />
                  </td>
                  <td className="border border-invoice-border px-1 py-1">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent px-1 outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </td>
                  <td className="border border-invoice-border px-1 py-1">
                    <input
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent px-1 text-center outline-none text-foreground"
                    />
                  </td>
                  <td className="border border-invoice-border px-1 py-1">
                    <input
                      value={item.uom}
                      onChange={(e) => updateItem(item.id, "uom", e.target.value)}
                      className="w-full bg-transparent px-1 text-center outline-none text-foreground"
                    />
                  </td>
                  <td className="border border-invoice-border px-1 py-1">
                    <input
                      type="number"
                      min={0}
                      value={item.rate || ""}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent px-1 text-right outline-none text-foreground"
                    />
                  </td>
                  <td className="border border-invoice-border px-2 py-1.5 text-right font-mono">
                    {formatNum(item.amount)}
                  </td>
                  <td className="no-print border border-invoice-border px-1 py-1 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:opacity-70 disabled:opacity-30"
                      disabled={items.length <= 1}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Empty rows for print to fill space */}
              {items.length < 10 &&
                Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="print-only">
                    <td className="border border-invoice-border px-2 py-3">&nbsp;</td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                    <td className="border border-invoice-border px-2 py-3"></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Add item button */}
        <div className="no-print mt-3">
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 rounded border border-input px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            <Plus size={15} />
            Add Item
          </button>
        </div>

        {/* Totals section */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left side: In Words + Remarks */}
          <div className="space-y-3 text-sm">
            <div className="border border-invoice-border p-3">
              <div className="flex gap-2">
                <span className="w-24 shrink-0 font-semibold text-foreground">TOTAL</span>
                <span className="border-b border-dashed border-invoice-border text-right font-bold text-foreground md:hidden">
                  {formatNum(subtotal)}
                </span>
              </div>
            </div>
            <div className="border border-invoice-border p-3">
              <p className="font-semibold text-foreground">INWORDS</p>
              <p className="mt-1 text-muted-foreground italic">{numberToWords(Math.round(netTotal))} only.</p>
            </div>
            <div className="border border-invoice-border p-3">
              <p className="font-semibold text-foreground">REMARKS</p>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="no-print-border mt-1 w-full resize-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Any remarks..."
              />
            </div>
          </div>

          {/* Right side: Calculations */}
          <div className="text-sm">
            <table className="ml-auto w-full border-collapse border border-invoice-border md:w-64">
              <tbody>
                <tr>
                  <td className="border border-invoice-border px-3 py-2 font-semibold text-foreground">TOTAL</td>
                  <td className="border border-invoice-border px-3 py-2 text-right font-mono text-foreground">
                    {formatNum(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-invoice-border px-3 py-2 font-semibold text-foreground">DISCOUNT</td>
                  <td className="border border-invoice-border px-1 py-1 text-right">
                    <input
                      type="number"
                      min={0}
                      value={discount || ""}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent px-2 py-1 text-right font-mono outline-none text-foreground"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-invoice-border px-3 py-2 font-semibold text-foreground">TAXABLE</td>
                  <td className="border border-invoice-border px-3 py-2 text-right font-mono text-foreground">
                    {formatNum(taxable)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-invoice-border px-3 py-2 font-semibold text-foreground">VAT 13%</td>
                  <td className="border border-invoice-border px-3 py-2 text-right font-mono text-foreground">
                    {formatNum(vat)}
                  </td>
                </tr>
                <tr className="bg-invoice-header-bg font-bold">
                  <td className="border border-invoice-border px-3 py-2 text-foreground">NET TOTAL</td>
                  <td className="border border-invoice-border px-3 py-2 text-right font-mono text-foreground">
                    {formatNum(netTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-end justify-between text-sm text-muted-foreground">
          <div>
            <p className="mt-12 border-t border-dashed border-invoice-border pt-1">Buyer's Signature</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{BUSINESS.name}</p>
            <p className="mt-12 border-t border-dashed border-invoice-border pt-1">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple number to words (for Nepali invoice style)
function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertLakh = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLakh(n % 100) : "");
    if (n < 100000) return convertLakh(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convertLakh(n % 1000) : "");
    if (n < 10000000) return convertLakh(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convertLakh(n % 100000) : "");
    return convertLakh(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convertLakh(n % 10000000) : "");
  };

  return convertLakh(num);
}

export default Index;
