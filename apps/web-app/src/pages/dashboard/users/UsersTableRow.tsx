import {
  TableRow,
  TableCell
} from "@/components/ui/Table"

import { Button } from "@/components/ui/Button"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Props {
  user: User
  handleRoleChange: (id: string, role: string) => void
  handleAssign: (id: string) => void
}

export default function UsersTableRow({
  user,
  handleRoleChange,
  handleAssign
}: Props) {

  return (

    <TableRow>

      <TableCell>{user.name}</TableCell>

      <TableCell>{user.email}</TableCell>

      <TableCell className="capitalize">
        {user.role || "staff"}
      </TableCell>

      <TableCell>

        <Select
          onValueChange={(value) =>
            handleRoleChange(user.id, value)
          }
        >

          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>

          </SelectContent>

        </Select>

      </TableCell>

      <TableCell className="text-right">

        <Button
          className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleAssign(user.id)}
        >
          Assign
        </Button>

      </TableCell>

    </TableRow>

  )

}