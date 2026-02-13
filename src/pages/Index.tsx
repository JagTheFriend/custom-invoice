import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn, fmt } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Items from "@/components/Items";
import { CalendarIcon, Plus, Printer } from "lucide-react";
import EmptyItems from "@/components/EmptyItems";
import ResultRow from "@/components/ResultRow";

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
	vat: "604366751",
} as const;

const generateInvoiceNo = () => {
	const num = Math.floor(Math.random() * 90000) + 10000;
	return `SB-${num}`;
};

const EMPTY_ROWS_TARGET = 15;
const CREDENTIALS = { email: "dipeshsah12@gmail.com", password: "Deep@3256" };

const Index = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");

	const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNo());
	const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
	const [customerName, setCustomerName] = useState("DIPESH MOBILE CENTER");
	const [customerContact, setCustomerContact] = useState(
		"PRATIMACHAUK, BIRGUNJ-15",
	);
	const [customerVat, setCustomerVat] = useState("604057215");
	const [payMode, setPayMode] = useState("CASH");
	const [discount, setDiscount] = useState(0);
	const [remarks, setRemarks] = useState("");
	const [items, setItems] = useState<InvoiceItem[]>([
		{
			id: 1,
			hsCode: "",
			description: "",
			qty: 1,
			uom: "PCS",
			rate: 0,
			amount: 0,
		},
	]);

	const updateItem = (
		id: number,
		field: keyof InvoiceItem,
		value: string | number,
	) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;
				const updated = { ...item, [field]: value };
				if (field === "qty" || field === "rate") {
					updated.amount = Number(updated.qty) * Number(updated.rate);
				}
				return updated;
			}),
		);
	};

	const addItem = () => {
		const newId =
			items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
		setItems([
			...items,
			{
				id: newId,
				hsCode: "",
				description: "",
				qty: 1,
				uom: "PCS",
				rate: 0,
				amount: 0,
			},
		]);
	};

	const removeItem = (id: number) => {
		if (items.length <= 1) return;
		setItems(items.filter((i) => i.id !== id));
	};

	const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
	const taxable = subtotal - discount;
	const vat = taxable * 0.13;
	const netTotal = taxable + vat;
	const emptyRowCount = Math.max(0, EMPTY_ROWS_TARGET - items.length);
	const handleLogin = () => {
		if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
			setIsAuthenticated(true);
			setAuthError("");
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="w-full max-w-sm border border-border rounded-lg bg-card p-8 shadow-lg">
					<h2 className="text-xl font-bold text-foreground text-center mb-6">
						🔒 Invoice Login
					</h2>
					{authError && (
						<p className="text-destructive text-sm text-center mb-4">
							{authError}
						</p>
					)}
					<div className="space-y-4">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleLogin()}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<button
							onClick={handleLogin}
							className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
						>
							Login
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			{/* Action bar */}
			<div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between">
				<h1 className="text-2xl font-bold text-foreground">
					Invoice Generator
				</h1>
				<button
					onClick={() => window.print()}
					className="flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
				>
					<Printer size={18} />
					Print Invoice
				</button>
			</div>

			{/* Invoice */}
			<div className="invoice-container mx-auto max-w-[210mm] border border-foreground bg-card p-8 shadow-sm md:p-10">
				{/* Header */}
				<div className="border-b-2 border-foreground pb-3 text-center">
					<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
						Tax Invoice
					</p>
					<h2 className="mt-0.5 text-xl font-extrabold uppercase tracking-wide text-foreground">
						{BUSINESS.name}
					</h2>
					<p className="text-xs text-foreground">{BUSINESS.address}</p>
					<p className="text-xs text-foreground">PAN NO: {BUSINESS.vat}</p>
				</div>

				{/* Party + Invoice meta */}
				<div className="invoice-meta-row mt-3 flex flex-col gap-0 text-[12px] md:flex-row md:justify-between">
					<div className="space-y-0.5">
						<div className="flex">
							<span className="inline-block w-[70px] font-bold text-foreground">
								PARTY
							</span>
							<span className="text-foreground">: </span>
							<input
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
								placeholder="Customer Name"
								className="invoice-input ml-1 flex-1 text-foreground"
							/>
						</div>
						<div className="flex">
							<span className="inline-block w-[70px] font-bold text-foreground">
								ADDRESS
							</span>
							<span className="text-foreground">: </span>
							<input
								value={customerContact}
								onChange={(e) => setCustomerContact(e.target.value)}
								placeholder="Address"
								className="invoice-input ml-1 flex-1 text-foreground"
							/>
						</div>
						<div className="flex">
							<span className="inline-block w-[70px] font-bold text-foreground">
								VAT/PAN
							</span>
							<span className="text-foreground">: </span>
							<input
								value={customerVat}
								onChange={(e) => setCustomerVat(e.target.value)}
								placeholder="Address"
								className="invoice-input ml-1 flex-1 text-foreground"
							/>
						</div>
					</div>
					<div className="invoice-meta-right mt-2 space-y-0.5 md:mt-0 md:text-right">
						<div className="flex md:justify-end">
							<span className="font-bold text-foreground">INVOICE NO</span>
							<span className="text-foreground ml-2">: </span>
							<input
								value={invoiceNo}
								onChange={(e) => setInvoiceNo(e.target.value)}
								className="invoice-input ml-1 w-[100px] text-right text-foreground"
							/>
						</div>
						<div className="flex md:justify-end">
							<span className="font-bold text-foreground">INVOICE DATE</span>
							<span className="text-foreground ml-2">: </span>
							<Popover>
								<PopoverTrigger asChild>
									<button className="invoice-input ml-1 w-[120px] text-right text-foreground flex items-center justify-end gap-1">
										{format(invoiceDate, "dd/MM/yyyy")}
										<CalendarIcon
											size={12}
											className="no-print shrink-0 opacity-50"
										/>
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 no-print" align="end">
									<Calendar
										mode="single"
										selected={invoiceDate}
										onSelect={(d) => d && setInvoiceDate(d)}
										initialFocus
										className={cn("p-3 pointer-events-auto")}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>

				{/* Pay Mode */}
				<div className="mt-3 text-center text-[12px] font-bold text-foreground">
					PAY MODE &nbsp;: &nbsp;
					<select
						value={payMode}
						onChange={(e) => setPayMode(e.target.value)}
						className="invoice-input text-foreground font-bold"
					>
						<option value="CASH">CASH</option>
						<option value="CHEQ">CHEQ</option>
						<option value="CREDIT">CREDIT</option>
						<option value="CASH/CHEQ/CREDIT">CASH/CHEQ/CREDIT</option>
					</select>
				</div>

				{/* Items Table */}
				<table
					className="mt-2 w-full border-collapse text-[12px]"
					style={{ borderColor: "hsl(var(--foreground))" }}
				>
					<thead>
						<tr className="text-foreground">
							<th className="invoice-cell w-[30px] text-center">SN</th>
							<th className="invoice-cell w-[75px] text-left">H.S CODE</th>
							<th className="invoice-cell text-left">DESCRIPTION</th>
							<th className="invoice-cell w-[50px] text-center">QTY</th>
							<th className="invoice-cell w-[50px] text-center">UOM</th>
							<th className="invoice-cell w-[85px] text-right">RATE</th>
							<th className="invoice-cell w-[90px] text-right">AMOUNT</th>
							<th className="no-print invoice-cell w-[30px] text-center">
								&nbsp;
							</th>
						</tr>
					</thead>
					<tbody>
						<Items
							items={items}
							removeItem={removeItem}
							updateItem={updateItem}
						/>
						{/* Empty rows to fill page */}
						<EmptyItems emptyRowCount={emptyRowCount} />
						{/* TOTAL row */}
						<ResultRow subtotal={subtotal} />
					</tbody>
				</table>

				{/* Add item button */}
				<div className="no-print m-2 w-full flex justify-center">
					<Button onClick={addItem} className="text-xs font-medium">
						<Plus size={14} /> Add Item
					</Button>
				</div>

				{/* Bottom section: INWORDS/REMARKS left, DISCOUNT/TAXABLE/VAT/NET right */}
				<div
					className="mt-0 flex text-[12px]"
					style={{ borderColor: "hsl(var(--foreground))" }}
				>
					{/* Left: INWORDS + REMARKS */}
					<div className="flex-1 border border-t-0 border-foreground">
						<div className="h-[95px] flex border-b border-foreground">
							<div className="w-[80px] shrink-0 border-r border-foreground px-2 py-1.5 font-bold text-foreground">
								INWORDS
							</div>
							<div className="flex-1 px-2 py-1.5 text-foreground italic">
								{numberToWords(Math.round(netTotal))} only.
							</div>
						</div>
						<div className="flex">
							<div className="w-[80px] shrink-0 border-r border-foreground px-2 py-1.5 font-bold text-foreground">
								REMARKS
							</div>
							<div className="flex-1 px-2 py-1">
								<textarea
									value={remarks}
									onChange={(e) => setRemarks(e.target.value)}
									rows={1}
									className="invoice-input w-full resize-none text-foreground"
									placeholder="Any remarks..."
								/>
							</div>
						</div>
					</div>
					{/* Right: Calculations */}
					<div className="w-[220px] shrink-0 border-b border-r border-foreground">
						{[
							{ label: "DISCOUNT", value: null },
							{ label: "TAXABLE", value: fmt(taxable) },
							{ label: "VAT 13%", value: fmt(vat) },
							{ label: "NET TOTAL", value: fmt(netTotal), bold: true },
						].map((row) => (
							<div
								key={row.label}
								className={`flex border-t border-foreground ${row.bold ? "font-bold" : ""}`}
							>
								<div className="flex-1 border-r border-foreground px-2 py-1.5 text-foreground">
									{row.label}
								</div>
								<div className="w-[100px] px-2 py-1.5 text-right font-mono text-foreground">
									{row.value !== null ? (
										row.value
									) : (
										<input
											type="number"
											min={0}
											value={discount || ""}
											onChange={(e) =>
												setDiscount(parseFloat(e.target.value) || 0)
											}
											className="invoice-input w-full text-right font-mono text-foreground"
										/>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Footer signatures */}
				<div className="mt-16 flex items-end justify-between text-[12px]">
					<div>
						<div className="w-[180px] border-t border-dashed border-foreground pt-1 text-center text-foreground">
							Buyer's Signature
						</div>
					</div>
					<div className="text-center">
						{/* <p className="font-bold text-foreground">{BUSINESS.name}</p> */}
						<div className="mt-10 w-[200px] border-t border-dashed border-foreground pt-1 text-center text-foreground">
							Authorized Signature
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

function numberToWords(num: number): string {
	if (num === 0) return "Zero";
	const ones = [
		"",
		"One",
		"Two",
		"Three",
		"Four",
		"Five",
		"Six",
		"Seven",
		"Eight",
		"Nine",
		"Ten",
		"Eleven",
		"Twelve",
		"Thirteen",
		"Fourteen",
		"Fifteen",
		"Sixteen",
		"Seventeen",
		"Eighteen",
		"Nineteen",
	];
	const tens = [
		"",
		"",
		"Twenty",
		"Thirty",
		"Forty",
		"Fifty",
		"Sixty",
		"Seventy",
		"Eighty",
		"Ninety",
	];
	const convertLakh = (n: number): string => {
		if (n === 0) return "";
		if (n < 20) return ones[n];
		if (n < 100)
			return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
		if (n < 1000)
			return (
				ones[Math.floor(n / 100)] +
				" Hundred" +
				(n % 100 ? " " + convertLakh(n % 100) : "")
			);
		if (n < 100000)
			return (
				convertLakh(Math.floor(n / 1000)) +
				" Thousand" +
				(n % 1000 ? " " + convertLakh(n % 1000) : "")
			);
		if (n < 10000000)
			return (
				convertLakh(Math.floor(n / 100000)) +
				" Lakh" +
				(n % 100000 ? " " + convertLakh(n % 100000) : "")
			);
		return (
			convertLakh(Math.floor(n / 10000000)) +
			" Crore" +
			(n % 10000000 ? " " + convertLakh(n % 10000000) : "")
		);
	};
	return convertLakh(num);
}

export default Index;
