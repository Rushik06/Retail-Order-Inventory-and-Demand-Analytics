export type LowStockEvent = {
    productId:string;
    warehouseId:string;
    currentQty:number;
    threshold:number;
}