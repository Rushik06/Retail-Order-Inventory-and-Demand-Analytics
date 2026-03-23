export const QUEUES = {
    EXCHANGE : "inventory.events",
    QUEUE : "inventory.alerts.queue",
    DLX :  "inventory.events.dlx",
    DLQ :  "inventory.alerts.dlq",
    DLQ_ROUTING_KEY :"inventory.dead",
} as const;