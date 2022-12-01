import * as fs from 'fs';

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day4/input.txt", 'utf8')
        .split("\n\n")
        .slice(0,-1)

let randomNumbers: number[] = []

let res = data.shift()
res
? randomNumbers = res.split(",").map(num => parseInt (num))
: []

type Cell = {
    Field: number,
    Picked: boolean
}

const boards =
    data
    .map(board => board.split("\n"))
    .map(board => board.map(row => row.split(" ")))
    .map(board => {
        return (
            board.map(row => {
            return (
                row
                .filter(entry => entry != '')
                .map(entry => {
                    let result: Cell =
                        {
                            Field: parseInt(entry),
                            Picked: false
                        }
                    return result
                })
            )})
    )})

const linePicked = (line: Cell[]) => {
    let result = line.filter(cell => !cell.Picked)  
    return (result.length === 0)
}

const checkWinners = (board: Cell[][], diagonal: boolean) => {
    let transposed = board[0].map((_, colIndex) => board.map(row => row[colIndex]))
    let wonRows =
        board
        .map(row => linePicked (row))
        .filter(rowIsSolved => rowIsSolved)      

    let wonCols =
        transposed
        .map(col => linePicked (col))
        .filter(colIsSolved => colIsSolved)

    let wonDiagonals: boolean
    if (diagonal) {
        let diagonal1: Cell[] = []
        let diagonal2: Cell[] = []
        board
        .map((row, rowIndex) => {
            diagonal1.push(row[rowIndex])
            diagonal2.push(row[row.length - 1 - rowIndex])
        })
        wonDiagonals = (linePicked (diagonal1) || linePicked (diagonal2))
    } else {
        wonDiagonals = false
    }
    return (wonRows.length > 0 || wonCols.length > 0 || wonDiagonals)
}
const markPicked = (board: Cell[][], picked:number) => {
    board
    .map(row => {
        row
        .map(cell => {
            if (cell.Field === picked) {
                cell.Picked = true
            }
        })
    })
}

type SolvedBoard ={
    Index: number,
    LastChecked: number,
    Board: Cell[][]
}

const solveForFirstWinner = (boards: Cell[][][], numbers: number[]) => {
    let boardSolved: SolvedBoard = {
        Index: -1,
        LastChecked: -1,
        Board: []
    }
    outer:
    for (let entry of numbers) {
        for (let i=0; i<boards.length; i++) {
            markPicked (boards[i],entry)
            if (checkWinners (boards[i], false)){
                boardSolved = {
                    Index: i,
                    LastChecked: entry,
                    Board: boards[i]
                }
                break outer
            }
        }
    }
    return boardSolved
}

const solveForLastWinner = (boards: Cell[][][], numbers: number[]) => {
    let finishedBoards: SolvedBoard[] = []
    let solvedIndices: number [] = []
    outer:
    for (let entry of numbers) {
        for (let i=0; i<boards.length; i++) {
            if (!solvedIndices.includes(i)) {
                markPicked (boards[i],entry)
                if (checkWinners (boards[i], false)){
                    finishedBoards.push(
                        {
                            Index: i,
                            LastChecked: entry,
                            Board: boards[i]
                        }
                    )
                    solvedIndices.push(i)
                }
            }
        }
    }
    return finishedBoards[finishedBoards.length-1]

}

let calculateScore = (board: SolvedBoard) => {
    let num =
        board.Board
        .flat()
        .filter(entry => !entry.Picked)
        .map (entry => entry.Field)
        .reduce((prev,current) => prev + current)
    return (num * board.LastChecked)
}

const visualizeBoard = (board: Cell[][]) => {
    return(
        board.map (row => {
            return (
            row
            .map(entry =>{
                if (entry.Picked) {
                    return `X`
                } else {
                    return 'O'
                }
            })
            .join("")
        )})
        .join("\n")
    )
}
let solvedWinner = solveForFirstWinner(boards,randomNumbers)
let solvedLoser = solveForLastWinner(boards,randomNumbers)
// console.log(visualizeBoard (solved.Board))
console.log(`We will win with : Board ${solvedWinner.Index} solvedWinner @ ${calculateScore(solvedWinner)} Points`)
console.log(`We will lose with : Board ${solvedLoser.Index} solvedLooser @ ${calculateScore(solvedLoser)} Points`)