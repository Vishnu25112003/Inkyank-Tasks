"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuiz } from "@/components/context/QuizContext"
import { Trophy, Medal, Award, Home, Users, Target } from "lucide-react"

const Leaderboard = () => {
  const router = useRouter()
  const { quizState } = useQuiz()

  const sortedPlayers = [...quizState.players].sort((a, b) => b.score - a.score)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">1st Place</Badge>
      case 2:
        return <Badge className="bg-gray-400 hover:bg-gray-500">2nd Place</Badge>
      case 3:
        return <Badge className="bg-amber-600 hover:bg-amber-700">3rd Place</Badge>
      default:
        return <Badge variant="outline">#{rank}</Badge>
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600">Current quiz rankings</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedPlayers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No players have joined yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedPlayers.map((player, index) => {
                      const rank = index + 1
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            rank <= 3 ? "bg-gradient-to-r from-gray-50 to-white" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {getRankIcon(rank)}
                            <div>
                              <h3 className="font-semibold text-lg">{player.name}</h3>
                              <p className="text-sm text-gray-600">{player.correctAnswers || 0} correct answers</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{player.score}</div>
                            {getRankBadge(rank)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top 3 Podium */}
            {sortedPlayers.length >= 3 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Top 3 Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-end gap-4">
                    {/* 2nd Place */}
                    <div className="text-center">
                      <div className="w-20 h-16 bg-gray-400 rounded-t-lg flex items-end justify-center pb-2">
                        <Medal className="w-8 h-8 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-b-lg">
                        <p className="font-semibold">{sortedPlayers[1]?.name}</p>
                        <p className="text-sm text-gray-600">{sortedPlayers[1]?.score} pts</p>
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-yellow-500 rounded-t-lg flex items-end justify-center pb-2">
                        <Trophy className="w-10 h-10 text-white" />
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-b-lg">
                        <p className="font-semibold">{sortedPlayers[0]?.name}</p>
                        <p className="text-sm text-gray-600">{sortedPlayers[0]?.score} pts</p>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                      <div className="w-20 h-12 bg-amber-600 rounded-t-lg flex items-end justify-center pb-2">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-amber-100 p-3 rounded-b-lg">
                        <p className="font-semibold">{sortedPlayers[2]?.name}</p>
                        <p className="text-sm text-gray-600">{sortedPlayers[2]?.score} pts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quiz Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quiz Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Players:</span>
                  <span className="font-semibold">{quizState.players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quiz Status:</span>
                  <Badge variant={quizState.isActive ? "default" : "secondary"}>
                    {quizState.isActive ? "Active" : "Ended"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Questions Asked:</span>
                  <span className="font-semibold">{quizState.questionsAsked || 0}</span>
                </div>
                {sortedPlayers.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Highest Score:</span>
                      <span className="font-semibold">{sortedPlayers[0]?.score || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score:</span>
                      <span className="font-semibold">
                        {Math.round(
                          sortedPlayers.reduce((sum, player) => sum + player.score, 0) / sortedPlayers.length,
                        )}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => router.push("/player")}>
                  Join as Player
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/admin")}>
                  Admin Panel
                </Button>
                <Button variant="outline" className="w-full">
                  Export Results
                </Button>
                <Button variant="outline" className="w-full">
                  Share Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            {sortedPlayers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sortedPlayers[0]?.score > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Quiz Champion: {sortedPlayers[0]?.name}</span>
                    </div>
                  )}
                  {sortedPlayers.length >= 5 && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Popular Quiz: 5+ Players</span>
                    </div>
                  )}
                  {quizState.isActive && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Live Competition Active</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
