"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/components/context/QuizContext"
import { User, Clock, Trophy, CheckCircle, XCircle, Home, Wifi, WifiOff } from "lucide-react"

const PlayerPanel = () => {
  const router = useRouter()
  const { quizState, joinQuiz, submitAnswer } = useQuiz()
  const [playerName, setPlayerName] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)

  useEffect(() => {
    if (quizState.currentQuestion && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, quizState.currentQuestion])

  useEffect(() => {
    if (quizState.currentQuestion) {
      setTimeLeft(quizState.currentQuestion.timeLimit)
      setSelectedAnswer(null)
      setHasAnswered(false)
    }
  }, [quizState.currentQuestion])

  const handleJoinQuiz = () => {
    if (playerName.trim()) {
      joinQuiz(playerName.trim())
      setIsJoined(true)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null && !hasAnswered) {
      submitAnswer(selectedAnswer, playerName)
      setHasAnswered(true)
    }
  }

  const currentPlayer = quizState.players.find((p) => p.name === playerName)

  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Join Quiz</CardTitle>
            <p className="text-gray-600">Enter your name to participate</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playerName">Your Name</Label>
              <Input
                id="playerName"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJoinQuiz()}
              />
            </div>
            <Button onClick={handleJoinQuiz} className="w-full" disabled={!playerName.trim()}>
              Join Quiz
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Player</h1>
            <p className="text-gray-600">Welcome, {playerName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {quizState.isActive ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <Badge variant={quizState.isActive ? "default" : "secondary"}>
                {quizState.isActive ? "Live" : "Waiting"}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Quiz Area */}
          <div className="lg:col-span-2">
            {!quizState.isActive ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Waiting for Quiz to Start</h3>
                  <p className="text-gray-600">The admin will start the quiz shortly. Stay tuned!</p>
                </CardContent>
              </Card>
            ) : !quizState.currentQuestion ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quiz in Progress</h3>
                  <p className="text-gray-600">Waiting for the next question...</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Current Question</CardTitle>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-lg">{timeLeft}s</span>
                    </div>
                  </div>
                  <Progress value={(timeLeft / quizState.currentQuestion.timeLimit) * 100} className="mt-2" />
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-6">{quizState.currentQuestion.question}</h3>

                  <div className="grid gap-3 mb-6">
                    {quizState.currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className="justify-start text-left h-auto p-4"
                        onClick={() => !hasAnswered && setSelectedAnswer(index)}
                        disabled={hasAnswered || timeLeft === 0}
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    {hasAnswered ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Answer submitted!</span>
                      </div>
                    ) : timeLeft === 0 ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Time's up!</span>
                      </div>
                    ) : (
                      <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="px-8">
                        Submit Answer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Player Stats */}
          <div className="space-y-6">
            {/* Player Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-semibold">{playerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-semibold">{currentPlayer?.score || 0} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span className="font-semibold">
                      #{quizState.players.sort((a, b) => b.score - a.score).findIndex((p) => p.name === playerName) + 1}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quizState.players
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex justify-between items-center p-2 rounded ${
                          player.name === playerName ? "bg-blue-100" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">#{index + 1}</span>
                          <span className={player.name === playerName ? "font-bold" : ""}>{player.name}</span>
                        </div>
                        <Badge variant="outline">{player.score} pts</Badge>
                      </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/leaderboard")}>
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Players:</span>
                  <span>{quizState.players.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant={quizState.isActive ? "default" : "secondary"}>
                    {quizState.isActive ? "Active" : "Waiting"}
                  </Badge>
                </div>
                {quizState.currentQuestion && (
                  <div className="flex justify-between text-sm">
                    <span>Responses:</span>
                    <span>
                      {quizState.responses.length}/{quizState.players.length}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerPanel
