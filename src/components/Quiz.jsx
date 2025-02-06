import "../components/Quiz.style.css"
import { data } from "../assets/data"
import { useEffect, useRef, useState } from "react"

const Quiz = () => {
  let [index, setIndex] = useState(0)
  let [score, setScore] = useState(0)
  let [question, setQuestion] = useState(data[index])
  let [lock, setLock] = useState(false)
  let [result, setResult] = useState(false)
  let [timer, setTimer] = useState(30)
  let [message, setMessage] = useState("")

  let Option1 = useRef(null)
  let Option2 = useRef(null)
  let Option3 = useRef(null)
  let Option4 = useRef(null)

  let option_array = [Option1, Option2, Option3, Option4]

  useEffect(() => {
    if (result || lock) return

    const countDown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    const timeout = setTimeout(() => {
      if (!lock) {
        setLock(true)
        option_array[question.ans - 1].current.classList.add("correct")
        setMessage("Temps écoulé ! La bonne réponse a été sélectionnée.")

        setTimeout(() => {
          setMessage("")
          next()
        }, 5000)
      }
    }, 30000)

    return () => {
      clearInterval(countDown)
      clearTimeout(timeout)
    }
  }, [index, result, lock])

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct")
        setLock(true)
        setScore((prev) => prev + 1)
      } else {
        e.target.classList.add("wrong")

        option_array[question.ans - 1].current.classList.add("correct")
      }
      setLock(true)
      setTimeout(() => {
        next()
      }, 5000)
    }
  }

  const next = () => {
    if (index === data.length - 1) {
      setResult(true)
      return
    }

    setIndex((prev) => prev + 1)
    setQuestion(data[index + 1])
    setLock(false)
    setTimer(30) // Réinitialisation du timer

    option_array.forEach((option) => {
      option.current.classList.remove("wrong", "correct")
    })
  }

  const reset = () => {
    setIndex(0)
    setQuestion(data[0])
    setScore(0)
    setLock(false)
    setResult(false)
    setTimer(30)
  }

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {result ? (
        <></>
      ) : (
        <>
          <h2>
            {index + 1}. {question.question}
          </h2>
          <p className="timer">⏳ Temps restant : {timer}</p>
          {message && <p className="message">{message}</p>}
          <ul>
            <li
              ref={Option1}
              onClick={(e) => {
                checkAns(e, 1)
              }}>
              {question.option1}
            </li>
            <li
              ref={Option2}
              onClick={(e) => {
                checkAns(e, 2)
              }}>
              {question.option2}
            </li>
            <li
              ref={Option3}
              onClick={(e) => {
                checkAns(e, 3)
              }}>
              {question.option3}
            </li>
            <li
              ref={Option4}
              onClick={(e) => {
                checkAns(e, 4)
              }}>
              {question.option4}
            </li>
          </ul>
          <button onClick={next} disabled={!lock}>
            Next
          </button>
          <div className="index">
            {index + 1} sur {data.length}
          </div>
        </>
      )}
      {result ? (
        <>
          <h2>
            Vous avez {score} points sur {data.length}
          </h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Quiz
