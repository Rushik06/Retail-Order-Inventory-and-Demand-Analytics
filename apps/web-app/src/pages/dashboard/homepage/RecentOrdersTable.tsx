import {
Card,
CardHeader,
CardTitle,
CardContent
} from "@/components/ui/Card";
/*eslint-disable @typescript-eslint/no-explicit-any */
export default function RecentOrdersTable({ data }: any){

return(

<Card>

<CardHeader>
<CardTitle>Recent Orders</CardTitle>
</CardHeader>

<CardContent>

<div className="max-h-[320px] overflow-y-auto">

<table className="w-full text-sm">

<thead className="border-b sticky top-0 bg-white">
<tr>
<th className="text-left py-2">Customer</th>
<th className="text-left py-2">Product</th>
<th className="text-right py-2">Qty</th>
<th className="text-right py-2">Status</th>
</tr>
</thead>

<tbody>

{data?.map((order:any,index:number)=>(

<tr key={index} className="border-b">

<td className="py-2">{order.customer}</td>
<td className="py-2 text-muted-foreground">{order.product}</td>
<td className="py-2 text-right">{order.quantity}</td>
<td className="py-2 text-right capitalize">{order.status}</td>

</tr>

))}

</tbody>

</table>

</div>

</CardContent>

</Card>

);

}