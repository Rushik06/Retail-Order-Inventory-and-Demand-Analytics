import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody
} from "@/components/ui/Table"

import UsersTableRow from "./UsersTableRow"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Props {
  users: User[]
  currentUserId?: string
  handleRoleChange: (id: string, role: string) => void
  handleAssign: (id: string) => void
}

export default function UsersTable({
  users,
  currentUserId,
  handleRoleChange,
  handleAssign
}: Props) {

  return (

    <Table>

      <TableHeader>

        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Assign Role</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>

      </TableHeader>

      <TableBody>

        {users
          .filter((u) => u.id !== currentUserId)
          .map((user) => (

            <UsersTableRow
              key={user.id}
              user={user}
              handleRoleChange={handleRoleChange}
              handleAssign={handleAssign}
            />

          ))}

      </TableBody>

    </Table>

  )

}