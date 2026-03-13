import { useEffect, useState } from "react"
import { fetchUsers, assignUserRole } from "@/app/app.logic"
import { useAuthStore } from "@/app/app.state"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/Card"

import { Loader2 } from "lucide-react"

import UsersTable from "./UsersTable"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Users() {

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoles, setSelectedRoles] = useState<Record<string,string>>({})

  const currentUser = useAuthStore((s) => s.user)

  const loadUsers = async () => {

    try {

      setLoading(true)

      const data = await fetchUsers()

      setUsers(data)

    } catch (err) {

      console.error("Failed to load users", err)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    loadUsers()

  }, [])

  const handleRoleChange = (userId:string, role:string) => {

    setSelectedRoles(prev => ({
      ...prev,
      [userId]: role
    }))

  }

  const handleAssign = async (userId:string) => {

    const roleName = selectedRoles[userId]

    if (!roleName) return

    try {

      await assignUserRole(userId, roleName)

      await loadUsers()

    } catch (err) {

      console.error("Role assignment failed", err)

    }

  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  return (
    <Card className="w-full">

      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>

      <CardContent>

        <UsersTable
          users={users}
          currentUserId={currentUser?.id}
          handleRoleChange={handleRoleChange}
          handleAssign={handleAssign}
        />

      </CardContent>

    </Card>
  )

}