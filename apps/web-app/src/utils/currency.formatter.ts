
    export const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `₹${(value / 1000000).toFixed(1)}M`;
        }

        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}K`;
        }

        return `₹${value}`;
    };

    export const formatFullCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);