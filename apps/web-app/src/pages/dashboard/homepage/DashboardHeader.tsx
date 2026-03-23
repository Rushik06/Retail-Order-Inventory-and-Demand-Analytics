import { useState } from "react";
import { Download, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

import {
    exportDashboardPDF,
    exportDashboardExcel,
    sendDashboardReportEmail
} from "@/app/reporting.logic";

import type { User } from "@/types/dashboard.types";

export default function DashboardHeader({ user }: { user: User }) {

    const [sendingEmail, setSendingEmail] = useState(false);

    const canExport =
        user?.role === "admin" ||
        user?.role === "manager" ||
        user?.role === "super_admin";

    const handlePDF = async () => {
        try {

            await exportDashboardPDF();
            toast.success("PDF exported successfully");

        } catch {

            toast.error("Failed to export PDF");

        }
    };

    const handleExcel = async () => {
        try {

            await exportDashboardExcel();
            toast.success("Excel exported successfully");

        } catch {

            toast.error("Failed to export Excel");

        }
    };

    const handleEmail = async () => {

        try {

            setSendingEmail(true);
            await sendDashboardReportEmail(user.email);
            toast.success("Report sent to your email");

        } catch {

            toast.error("Failed to send report email");

        } finally {

            setSendingEmail(false);

        }

    };

    return (

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">
                    Retail Analytics Dashboard
                </h1>

                <p className="text-muted-foreground text-sm mt-1">
                    Inventory, sales and demand insights
                </p>

            </div>

            {canExport && (

                <div className="flex gap-3">

                    <Button
                        variant="outline"
                        onClick={handlePDF}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleExcel}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Excel
                    </Button>

                    <Button
                        onClick={handleEmail}
                        disabled={sendingEmail}
                    >

                        {sendingEmail ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Email Report
                            </>
                        )}

                    </Button>
                </div>

            )}
        </div>

   );

}