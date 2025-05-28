"use client"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

interface Player {
  id: string
  name: string
  score: number
  correctAnswers: number
  totalAnswered: number
  isConnected: boolean
}

interface Question {
  id?: number
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface QuizState {
  isActive: boolean
  players: Player[]
  currentQuestion: Question | null
  responses: any[]
  questionsAsked: number
}

interface QuizContextType {
  quizState: QuizState
  startQuiz: () => void
  endQuiz: () => void
  joinQuiz: (name: string) => void
  sendQuestion: (question: Question) => void
  submitAnswer: (answer: number, playerName: string) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const initialState: QuizState = {
  isActive: false,
  players: [],
  currentQuestion: null,
  responses: [],
  questionsAsked: 0,
}

const quizReducer = (state: QuizState, action: any): QuizState => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload }

    case "START_QUIZ":
      return { ...state, isActive: true }

    case "END_QUIZ":
      return { ...state, isActive: false, currentQuestion: null, responses: [] }

    case "SEND_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        responses: [],
        questionsAsked: state.questionsAsked + 1,
      }

    case "SUBMIT_ANSWER":
      const response = {
        playerId: action.payload.playerId,
        playerName: action.payload.playerName,
        answer: action.payload.answer,
        timestamp: Date.now(),
      }
      return { ...state, responses: [...state.responses, response] }

    case "UPDATE_SCORES":
      return {
        ...state,
        players: state.players.map((player) => {
          const response = state.responses.find((r) => r.playerName === player.name)
          if (response && response.answer === state.currentQuestion?.correctAnswer) {
            return {
              ...player,
              score: player.score + 10,
              correctAnswers: (player.correctAnswers || 0) + 1,
            }
          }
          return player
        }),
      }

    default:
      return state
  }
}

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizState, dispatch] = useReducer(quizReducer, initialState)

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")

    // Socket listeners for live updates
    socket.on("state", (state) => {
      dispatch({ type: "SET_STATE", payload: state })
    })

    socket.on("question", (question) => {
      dispatch({ type: "SEND_QUESTION", payload: question })
    })

    socket.on("questionResults", (results) => {
      console.log("Question results:", results)
    })

    socket.on("notification", (notification) => {
      console.log("Notification:", notification)
    })

    return () => {
      socket.off("state")
      socket.off("question")
      socket.off("questionResults")
      socket.off("notification")
      socket.disconnect()
    }
  }, [])

  // Trigger server-side state changes
  const startQuiz = () => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
    socket.emit("startQuiz")
  }

  const endQuiz = () => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
    socket.emit("endQuiz")
  }

  const joinQuiz = (name: string) => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
    socket.emit("join", name)
  }

  const sendQuestion = (question: Question) => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
    socket.emit("sendQuestion", question)
  }

  const submitAnswer = (answer: number, playerName: string) => {
    const player = quizState.players.find((p) => p.name === playerName)
    if (player) {
      const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000")
      socket.emit("submitAnswer", {
        playerId: player.id,
        playerName: player.name,
        answer,
      })
    }
  }

  return (
    <QuizContext.Provider
      value={{
        quizState,
        startQuiz,
        endQuiz,
        joinQuiz,
        sendQuestion,
        submitAnswer,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
