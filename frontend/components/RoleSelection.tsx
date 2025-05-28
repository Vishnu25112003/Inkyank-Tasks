"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, Trophy } from "lucide-react"

const RoleSelection = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Quiz Game</h1>
          <p className="text-lg text-gray-600">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Admin Panel</CardTitle>
              <CardDescription>Manage quiz sessions, send questions, and monitor player responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700">Enter as Admin</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/player")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Player</CardTitle>
              <CardDescription>Join quiz sessions, answer questions, and compete with others</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Join as Player</Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/leaderboard")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Leaderboard</CardTitle>
              <CardDescription>View current rankings and quiz results</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">View Leaderboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
