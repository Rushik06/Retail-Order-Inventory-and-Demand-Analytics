/* eslint-disable */

import { Eye, Power, ArrowUpDown, CheckCircle } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";


/* Warehouse Type */

type Warehouse = {
  warehouse_id: string;
  name: string;
  location: string;
  is_active: boolean;
};


/* Component Props */

interface WarehouseTableProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSortField: React.Dispatch<React.SetStateAction<"name" | "location">>;
  paginated: Warehouse[];
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleView: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleActivate: (id: string) => void;
}


export default function WarehouseTable({
  search,
  setSearch,
  setSortField,
  paginated,
  page,
  totalPages,
  setPage,
  handleView,
  handleDeactivate,
  handleActivate,
}: WarehouseTableProps) {

  const actionBtn =
    "h-9 w-9 p-0 flex items-center justify-center";

  return (
    <Card className="shadow-sm">

      <CardHeader className="flex flex-row justify-between items-center">

        <CardTitle className="text-xl font-semibold">
          Warehouses
        </CardTitle>

        <Input
          placeholder="Search warehouse..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </CardHeader>

      <CardContent>

        <div className="max-h-[400px] overflow-y-auto border rounded-lg">

          <Table>

            <TableHeader className="sticky top-0 bg-white">

              <TableRow>

                <TableHead
                  className="cursor-pointer text-base font-semibold"
                  onClick={() => setSortField("name")}
                >
                  <div className="flex items-center gap-2">
                    Name <ArrowUpDown size={16}/>
                  </div>
                </TableHead>

                <TableHead
                  className="cursor-pointer text-base font-semibold"
                  onClick={() => setSortField("location")}
                >
                  <div className="flex items-center gap-2">
                    Location <ArrowUpDown size={16}/>
                  </div>
                </TableHead>

                <TableHead className="text-base font-semibold">
                  Status
                </TableHead>

                <TableHead className="text-base font-semibold">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {paginated.map((w) => (

                <TableRow key={w.warehouse_id} className="text-base">

                  <TableCell className="font-medium">
                    {w.name}
                  </TableCell>

                  <TableCell>
                    {w.location}
                  </TableCell>

                  <TableCell>

                    {w.is_active ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Inactive
                      </span>
                    )}

                  </TableCell>

                  <TableCell>

                    <div className="flex items-center gap-3">

                      {/* VIEW */}
                      <Button
                        size="sm"
                        className={`${actionBtn} bg-green-600 hover:bg-green-700 text-white`}
                        onClick={() => handleView(w.warehouse_id)}
                      >
                        <Eye size={18}/>
                      </Button>

                      {/* ACTIVE / DEACTIVE */}
                      {w.is_active ? (

                        <Button
                          size="sm"
                          className={`${actionBtn} bg-orange-500 hover:bg-orange-600 text-white`}
                          onClick={() => handleDeactivate(w.warehouse_id)}
                        >
                          <Power size={18}/>
                        </Button>

                      ) : (

                        <Button
                          size="sm"
                          className={`${actionBtn} bg-blue-600 hover:bg-blue-700 text-white`}
                          onClick={() => handleActivate(w.warehouse_id)}
                        >
                          <CheckCircle size={18}/>
                        </Button>

                      )}

                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

        {/* PAGINATION */}

        <div className="flex justify-between items-center mt-6">

          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>

        </div>

      </CardContent>

    </Card>
  );
}