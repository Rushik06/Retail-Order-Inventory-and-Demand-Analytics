import {
Card,
CardHeader,
CardTitle,
CardContent
} from "@/components/ui/Card";
/*eslint-disable @typescript-eslint/no-explicit-any */
export default function InventoryActivityTable({ data }: any){

return(

<Card>

<CardHeader>
<CardTitle>Inventory Activity</CardTitle>
</CardHeader>

<CardContent>

<div className="max-h-[320px] overflow-y-auto">

<table className="w-full text-sm">

<thead className="border-b sticky top-0 bg-white">
<tr>
<th className="text-left py-2">Product</th>
<th className="text-left py-2">Warehouse</th>
<th className="text-left py-2">Location</th>
<th className="text-left py-2">Action</th>
<th className="text-right py-2">Qty</th>
</tr>
</thead>

<tbody>

{data?.map((item:any,index:number)=>(

<tr key={index} className="border-b">

<td className="py-2">{item.product}</td>
<td className="py-2 text-muted-foreground">{item.warehouse}</td>
<td className="py-2 text-muted-foreground">{item.location}</td>
<td className="py-2 capitalize">{item.action_type}</td>
<td className="py-2 text-right font-semibold">{item.quantity}</td>

</tr>

))}

</tbody>

</table>

</div>

</CardContent>

</Card>

);

}