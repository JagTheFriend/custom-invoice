export default function EmptyItems({ emptyRowCount }) {
	return (
		<>
			{Array.from({ length: emptyRowCount }).map((_, i) => (
				<tr key={`e-${i}`} className="[&>*]:border-y-0">
					<td className="invoice-cell h-[22px]">&nbsp;</td>
					<td className="invoice-cell"></td>
					<td className="invoice-cell"></td>
					<td className="invoice-cell"></td>
					<td className="invoice-cell"></td>
					<td className="invoice-cell"></td>
					<td className="invoice-cell"></td>
					<td className="no-print invoice-cell"></td>
				</tr>
			))}
		</>
	);
}
