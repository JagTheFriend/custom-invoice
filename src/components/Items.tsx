import { fmt } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function Items({ items, updateItem, removeItem }) {
	return (
		<>
			{items.map((item, idx) => (
				<tr key={item.id} className="[&>*]:border-y-0 text-foreground">
					<td className="invoice-cell text-center">{idx + 1}</td>
					<td className="invoice-cell p-0">
						<input
							value={item.hsCode}
							onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
							placeholder="H.S Code"
							className="invoice-table-input text-foreground placeholder:text-muted-foreground"
						/>
					</td>
					<td className="invoice-cell p-0">
						<input
							value={item.description}
							onChange={(e) =>
								updateItem(item.id, "description", e.target.value)
							}
							placeholder="Item description"
							className="invoice-table-input text-foreground placeholder:text-muted-foreground"
						/>
					</td>
					<td className="invoice-cell p-0">
						<input
							type="number"
							min={0}
							value={item.qty}
							onChange={(e) =>
								updateItem(item.id, "qty", parseFloat(e.target.value) || 0)
							}
							className="invoice-table-input text-center text-foreground"
						/>
					</td>
					<td className="invoice-cell p-0">
						<input
							value={item.uom}
							onChange={(e) => updateItem(item.id, "uom", e.target.value)}
							className="invoice-table-input text-center text-foreground"
						/>
					</td>
					<td className="invoice-cell p-0">
						<input
							type="number"
							min={0}
							value={item.rate || ""}
							onChange={(e) =>
								updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
							}
							className="invoice-table-input text-right text-foreground"
						/>
					</td>
					<td className="invoice-cell text-right font-mono">
						{fmt(item.amount)}
					</td>
					<td className="no-print invoice-cell text-center">
						<button
							onClick={() => removeItem(item.id)}
							className="text-destructive hover:opacity-70 disabled:opacity-30"
							disabled={items.length <= 1}
						>
							<Trash2 size={14} />
						</button>
					</td>
				</tr>
			))}
		</>
	);
}
