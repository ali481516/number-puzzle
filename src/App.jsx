import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, ''])
  const [isPlayerWin, setIsPlayerWin] = useState(false)
  const [secondEffect, setSecondEffect] = useState(false)
  const [counter, setCounter] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isFindSolutionClicked, setIsFindSolutionClicked] = useState(false)
  const [solution, setSolution] = useState([])

  let threshold = 10

  useEffect(() => {
    if (secondsLeft > 0 && !isPlayerWin) {
      setTimeout(() => {
        setSecondsLeft(secondsLeft - 1)
      }, 1000)
    }
  }, [secondsLeft])

  useEffect(() => {
    containerRef.current.focus()
  }, [])

  useEffect(() => {
    // console.log('secondEffect is running')
    if (secondsLeft > 0 && !isFindSolutionClicked) {
      let recievedIndex = Math.floor(Math.random() * 3)
      if (counter < threshold) {
        functions[recievedIndex]()
        recievedIndex = Math.floor(Math.random() * 3)
      } else {
        setSecondEffect(true)
      }
      if (secondEffect) {
        checkWinning()
        // console.log(`numbers = ${numbers} in effect`)
      }
    } else if (isFindSolutionClicked && solution.length > 0) {
      switch (solution.pop()) {
        case 'up':
          // console.log('up')
          setTimeout(upMoveHandler, 1000)
          // upMoveHandler()
          break
        case 'down':
          // console.log('down')
          setTimeout(downMoveHandler, 1000)
          // downMoveHandler()
          break
        case 'left':
          // console.log('left')
          setTimeout(leftMoveHandler, 1000)
          // leftMoveHandler()
          break
        case 'right':
          // console.log('right')
          setTimeout(rightMoveHandler, 1000)
          // rightMoveHandler()
          break
      }
    }
    if (secondEffect) {
      checkWinning()
      // console.log(`numbers = ${numbers} in effect`)
    }
  }, [numbers, counter, solution])

  const checkWinning = () => {
    let winState = [1, 2, 3, 4, 5, 6, 7, 8, '']
    // console.log(`numbers = ${numbers} in check method`)
    // console.log(`new numbers = ${newNumbers} in check method`)
    if (
      numbers.length === winState.length &&
      numbers.every((e, i) => e === winState[i])
    ) {
      // console.log('the condition is true')
      setIsPlayerWin(true)
    }
    // console.log('checked')
    // console.log(isGameDone)
  }

  const leftMoveHandler = () => {
    console.log('left handler:')
    let emptyBoxIndex = numbers.findIndex((element) => element == '')
    if (emptyBoxIndex != 0 && emptyBoxIndex != 3 && emptyBoxIndex != 6) {
      let newNumbers = [...numbers]

      // swap
      let temp = newNumbers[emptyBoxIndex - 1]
      newNumbers[emptyBoxIndex - 1] = newNumbers[emptyBoxIndex]
      newNumbers[emptyBoxIndex] = temp
      // console.log(newNumbers)

      setNumbers(newNumbers)
    }
    if (counter < threshold) setCounter(counter + 1)
  }

  const rightMoveHandler = () => {
    console.log('right handler:')
    let emptyBoxIndex = numbers.findIndex((element) => element == '')
    if (emptyBoxIndex != 2 && emptyBoxIndex != 5 && emptyBoxIndex != 8) {
      let newNumbers = [...numbers]

      // swap
      let temp = newNumbers[emptyBoxIndex + 1]
      newNumbers[emptyBoxIndex + 1] = newNumbers[emptyBoxIndex]
      newNumbers[emptyBoxIndex] = temp
      // console.log(newNumbers)

      setNumbers(newNumbers)
    }
    if (counter < threshold) setCounter(counter + 1)
  }

  const upMoveHandler = () => {
    console.log('up handler:')
    let emptyBoxIndex = numbers.findIndex((element) => element == '')
    if (emptyBoxIndex != 0 && emptyBoxIndex != 1 && emptyBoxIndex != 2) {
      let newNumbers = [...numbers]

      // swap
      let temp = newNumbers[emptyBoxIndex - 3]
      newNumbers[emptyBoxIndex - 3] = newNumbers[emptyBoxIndex]
      newNumbers[emptyBoxIndex] = temp
      // console.log(newNumbers)

      setNumbers(newNumbers)
    }
    if (counter < threshold) setCounter(counter + 1)
  }

  const downMoveHandler = () => {
    console.log('down handler:')
    let emptyBoxIndex = numbers.findIndex((element) => element == '')
    if (emptyBoxIndex != 6 && emptyBoxIndex != 7 && emptyBoxIndex != 8) {
      let newNumbers = [...numbers]

      // swap
      let temp = newNumbers[emptyBoxIndex + 3]
      newNumbers[emptyBoxIndex + 3] = newNumbers[emptyBoxIndex]
      newNumbers[emptyBoxIndex] = temp
      // console.log(newNumbers)

      setNumbers(newNumbers)
      // console.log(numbers)
    }
    if (counter < threshold) setCounter(counter + 1)
  }

  var functions = [
    upMoveHandler,
    downMoveHandler,
    leftMoveHandler,
    rightMoveHandler
  ]

  const keyboardHandler = (e) => {
    if (!isPlayerWin) {
      switch (e.key) {
        case 'ArrowUp':
          console.log('up')
          upMoveHandler()
          break
        case 'ArrowDown':
          console.log('down')
          downMoveHandler()
          break
        case 'ArrowLeft':
          console.log('left')
          leftMoveHandler()
          break
        case 'ArrowRight':
          console.log('right')
          rightMoveHandler()
          break
      }
    }
    // alert(e.key)
  }

  const containerRef = React.createRef()

  const findSolutionAutomatically = () => {
    let isFinished = false
    console.log('finding solution is started')
    let nodeNumbers = { state: [...numbers], action: null, parent: null }
    let winState = [1, 2, 3, 4, 5, 6, 7, 8, '']
    if (
      nodeNumbers.state.length === winState.length &&
      nodeNumbers.state.every((e, i) => e === winState[i])
    ) {
      checkWinning()
      console.log('solution is already done')
      return 'solution is already done'
    }
    let frontier = [nodeNumbers]
    let explored = []
    while (true) {
      // console.log('loop is started')
      if (frontier.length == 0) {
        console.log('failure')
        return 'failure'
      }

      nodeNumbers = frontier.reverse().pop()
      frontier.reverse()

      explored.push(nodeNumbers)
      for (const func of findMethodFunctions) {
        // console.log(`the find method function is: ${func}`)
        let child = func(nodeNumbers)

        if (
          frontier.findIndex((e) => {
            return (
              e.state.length === child.state.length &&
              e.state.every((e, i) => e === child.state[i])
            )
          }) == -1 &&
          explored.findIndex((e) => {
            return (
              e.state.length === child.state.length &&
              e.state.every((e, i) => e === child.state[i])
            )
          }) == -1
        ) {
          // console.log(`child: ${child}`)
          if (
            child.state.length === winState.length &&
            child.state.every((e, i) => e === winState[i])
          ) {
            console.log('solution is calculated')
            return Solution(child)
          }
          frontier.push(child)
        }
      }
    }

    // console.log(frontier)
  }

  const Solution = (node) => {
    let innerSolution = []
    while (node.parent != null) {
      console.log(node.action)
      innerSolution.push(node.action)
      node = node.parent
    }
    let solution2 = [...innerSolution]

    return solution2
  }

  // const doSolution = (solution) => {}

  const findMethodFunctions = [
    (numbers) => {
      // console.log('find up handler:')
      let emptyBoxIndex = numbers.state.findIndex((element) => element == '')
      if (emptyBoxIndex != 0 && emptyBoxIndex != 1 && emptyBoxIndex != 2) {
        let newNumbers = [...numbers.state]

        // swap
        let temp = newNumbers[emptyBoxIndex - 3]
        newNumbers[emptyBoxIndex - 3] = newNumbers[emptyBoxIndex]
        newNumbers[emptyBoxIndex] = temp
        // console.log(newNumbers)
        let returnValue = { state: newNumbers, action: 'up', parent: numbers }
        return returnValue
        // console.log(numbers)
      }
      let returnValue = { state: numbers.state, action: 'up', parent: numbers }
      return returnValue
    },
    (numbers) => {
      // console.log('find right handler:')
      let emptyBoxIndex = numbers.state.findIndex((element) => element == '')
      if (emptyBoxIndex != 2 && emptyBoxIndex != 5 && emptyBoxIndex != 8) {
        let newNumbers = [...numbers.state]

        // swap
        let temp = newNumbers[emptyBoxIndex + 1]
        newNumbers[emptyBoxIndex + 1] = newNumbers[emptyBoxIndex]
        newNumbers[emptyBoxIndex] = temp
        // console.log(newNumbers)
        let returnValue = {
          state: newNumbers,
          action: 'right',
          parent: numbers
        }
        return returnValue
        // console.log(numbers)
      }
      let returnValue = {
        state: numbers.state,
        action: 'right',
        parent: numbers
      }
      return returnValue
    },
    (numbers) => {
      // console.log('find down handler:')
      let emptyBoxIndex = numbers.state.findIndex((element) => element == '')
      if (emptyBoxIndex != 6 && emptyBoxIndex != 7 && emptyBoxIndex != 8) {
        let newNumbers = [...numbers.state]

        // swap
        let temp = newNumbers[emptyBoxIndex + 3]
        newNumbers[emptyBoxIndex + 3] = newNumbers[emptyBoxIndex]
        newNumbers[emptyBoxIndex] = temp
        // console.log(newNumbers)

        let returnValue = { state: newNumbers, action: 'down', parent: numbers }
        return returnValue
        // console.log(numbers)
      }
      let returnValue = {
        state: numbers.state,
        action: 'down',
        parent: numbers
      }
      return returnValue
    },
    (numbers) => {
      // console.log('find left handler:')
      let emptyBoxIndex = numbers.state.findIndex((element) => element == '')
      if (emptyBoxIndex != 0 && emptyBoxIndex != 3 && emptyBoxIndex != 6) {
        let newNumbers = [...numbers.state]

        // swap
        let temp = newNumbers[emptyBoxIndex - 1]
        newNumbers[emptyBoxIndex - 1] = newNumbers[emptyBoxIndex]
        newNumbers[emptyBoxIndex] = temp
        // console.log(newNumbers)

        let returnValue = { state: newNumbers, action: 'left', parent: numbers }
        return returnValue
        // console.log(numbers)
      }
      let returnValue = {
        state: numbers.state,
        action: 'left',
        parent: numbers
      }
      return returnValue
    }
  ]

  const PlayAgainHandler = () => {
    setIsFindSolutionClicked(false)
    containerRef.current.focus()
    setSecondsLeft(10)
    setSecondEffect(false)
    setIsPlayerWin(false)
    setCounter(1)
    let recievedIndex = Math.floor(Math.random() * 3)
    functions[recievedIndex]()
  }

  const playHandler = () => {
    setIsFindSolutionClicked(false)
    setSecondsLeft(10)
    containerRef.current.focus()
    setSecondEffect(false)
    setCounter(1)
    let recievedIndex = Math.floor(Math.random() * 3)
    functions[recievedIndex]()
  }

  const onFindClickHandler = () => {
    setIsFindSolutionClicked(true)
    let ans = findSolutionAutomatically()
    // console.log(ans)
    setSolution([...ans])
  }

  return (
    <>
      <div id="myBody">
        {/* <p className="winText">Congratulations!</p> */}
        {isPlayerWin ? (
          <div>
            {!isFindSolutionClicked ? <p id="winText">Congratulations!</p> : ''}

            <button id="playAgainButton" onClick={PlayAgainHandler}>
              Play again
            </button>
          </div>
        ) : secondsLeft == 0 ? (
          <button onClick={playHandler}>play</button>
        ) : (
          ''
        )}
        <p>Remaining time: {secondsLeft}</p>
        <div
          id="container"
          onKeyDown={keyboardHandler}
          tabIndex={0}
          ref={containerRef}
        >
          <div className="row">
            <div id="place1" className="box">
              {numbers[0]}
            </div>
            <div id="place2" className="box">
              {numbers[1]}
            </div>
            <div id="place3" className="box">
              {numbers[2]}
            </div>
          </div>
          <div className="row">
            <div id="place4" className="box">
              {numbers[3]}
            </div>
            <div id="place5" className="box">
              {numbers[4]}
            </div>
            <div id="place6" className="box">
              {numbers[5]}
            </div>
          </div>
          <div className="row">
            <div id="place7" className="box">
              {numbers[6]}
            </div>
            <div id="place8" className="box">
              {numbers[7]}
            </div>
            <div id="place9" className="box">
              {numbers[8]}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onFindClickHandler()
          }}
        >
          Find solution automatically!
        </button>
      </div>
    </>
  )
}

export default App
