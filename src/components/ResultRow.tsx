import { fmt } from "@/lib/utils";

export default function ResultRow({ subtotal }) {
  return (
    <>
      <tr className="text-foreground font-bold">
        <td className="invoice-cell" colSpan={2}></td>
        <td className="invoice-cell text-center font-bold">TOTAL</td>
        <td className="invoice-cell"></td>
        <td className="invoice-cell"></td>
        <td className="invoice-cell"></td>
        <td className="invoice-cell text-right font-mono">{fmt(subtotal)}</td>
        <td className="no-print invoice-cell"></td>
      </tr>
    </>
  );
}
