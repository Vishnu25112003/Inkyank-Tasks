"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useQuiz } from "@/components/context/QuizContext"
import { Play, Send, Users, Clock, CheckCircle, XCircle, Home, Plus, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const AdminPanel = () => {
  const router = useRouter()
  const { quizState, startQuiz, sendQuestion, endQuiz } = useQuiz()
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    timeLimit: 30,
  })
  const [questionBank, setQuestionBank] = useState([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      timeLimit: 30,
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      timeLimit: 30,
    },
  ])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every((opt) => opt.trim())) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now(),
      }
      setQuestionBank([...questionBank, newQuestion])
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        timeLimit: 30,
      })
    }
  }

  const removeQuestion = (id: number) => {
    setQuestionBank(questionBank.filter((q) => q.id !== id))
  }

  const sendQuestionToPlayers = (question: any) => {
    sendQuestion(question)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage your live quiz session</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quiz Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Quiz Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant={quizState.isActive ? "default" : "secondary"}>
                    {quizState.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-gray-600">Players Connected: {quizState.players.length}</span>
                </div>
                <div className="flex gap-2">
                  {!quizState.isActive ? (
                    <Button onClick={startQuiz} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  ) : (
                    <Button onClick={endQuiz} variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" />
                      End Quiz
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Question */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`option-${index}`}
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                        <Button
                          variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        >
                          {currentQuestion.correctAnswer === index ? <CheckCircle className="w-4 h-4" /> : "✓"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="10"
                      max="120"
                      value={currentQuestion.timeLimit}
                      onChange={(e) =>
                        setCurrentQuestion({ ...currentQuestion, timeLimit: Number.parseInt(e.target.value) })
                      }
                      className="w-24"
                    />
                  </div>
                  <Button onClick={addQuestion} className="mt-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Question Bank */}
            <Card>
              <CardHeader>
                <CardTitle>Question Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questionBank.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{question.question}</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => sendQuestionToPlayers(question)}
                            disabled={!quizState.isActive}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeQuestion(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {question.options.map((option, index) => (
                          <span
                            key={index}
                            className={`p-2 rounded ${
                              index === question.correctAnswer ? "bg-green-100 text-green-800" : "bg-gray-100"
                            }`}
                          >
                            {index + 1}. {option}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {question.timeLimit}s
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Stats */}
          <div className="space-y-6">
            {/* Connected Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Connected Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quizState.players.length === 0 ? (
                    <p className="text-gray-500 text-sm">No players connected</p>
                  ) : (
                    quizState.players.map((player) => (
                      <div key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{player.name}</span>
                        <Badge variant="outline">{player.score} pts</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Question Status */}
            {quizState.currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-3">{quizState.currentQuestion.question}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Responses:</span>
                      <span>
                        {quizState.responses.length}/{quizState.players.length}
                      </span>
                    </div>
                    <Progress value={(quizState.responses.length / Math.max(quizState.players.length, 1)) * 100} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => router.push("/leaderboard")}>
                  View Leaderboard
                </Button>
                <Button variant="outline" className="w-full">
                  Export Results
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
