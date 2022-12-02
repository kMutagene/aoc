import * as fs from 'fs';
import internal from 'stream';

const data = 
    fs.readFileSync('C:/Users/schne/source/repos/kMutagene/aoc/2021/day15/input.txt', 'utf8')
    .replace("\r\n","\n")
    .split("\n")
    .map (x => x.split('').map(n => Number(n)))

console.log(data)


class Coordinate {
    X:number
    Y:number

    constructor(x: number,y: number) {
        this.X = x
        this.Y = y
    }
}

class ScoredCoordinate {
    X:number
    Y:number
    Risk:number

    constructor(x: number,y: number, r:number) {
        this.X = x
        this.Y = y
        this.Risk = r
    }
}

// no diagonals
const getValidNeighbours = (x:number, y:number, xDim:number, yDim:number) => {
    switch(x) {
        case 0:
            switch(y) {
                case 0:
                    return [
                        new Coordinate(x+1,y),
                        new Coordinate(x,y+1)
                    ]
                case yDim:
                    return [
                        new Coordinate(x,y-1),
                        new Coordinate(x+1,y),
                    ]
                default:
                    return [
                        new Coordinate(x,y-1),
                        new Coordinate(x+1,y),
                        new Coordinate(x,y+1)
                    ]
            }
    case xDim:
        switch(y) {
            case 0:
                return [
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y)
                ]
            case yDim:
                return [
                    new Coordinate(x,y-1),
                    new Coordinate(x-1,y)
                ]
            default:
                return [
                    new Coordinate(x,y-1),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y)
                ]
        }
    default :
        switch(y) {
            case 0:
                return [
                    new Coordinate(x+1,y),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y)
                ]
            case yDim: 
                return [
                    new Coordinate(x,y-1),
                    new Coordinate(x+1,y),
                    new Coordinate(x-1,y)
                ]
            default:
                return [
                    new Coordinate(x,y-1),
                    new Coordinate(x+1,y),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y)
                ]

        }
    }
}
// with diagonals
const getValidNeighboursDiag = (x:number, y:number, xDim:number, yDim:number) => {
    switch(x) {
        case 0:
            switch(y) {
                case 0:
                    return [
                        new Coordinate(x+1,y),
                        new Coordinate(x+1,y+1),
                        new Coordinate(x,y+1)
                    ]
                case yDim:
                    return [
                        new Coordinate(x,y-1),
                        new Coordinate(x+1,y-1),
                        new Coordinate(x+1,y),
                    ]
                default:
                    return [
                        new Coordinate(x,y-1),
                        new Coordinate(x+1,y-1),
                        new Coordinate(x+1,y),
                        new Coordinate(x+1,y+1),
                        new Coordinate(x,y+1)
                    ]
            }
    case xDim:
        switch(y) {
            case 0:
                return [
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y+1),
                    new Coordinate(x-1,y)
                ]
            case yDim:
                return [
                    new Coordinate(x-1,y-1),
                    new Coordinate(x,y-1),
                    new Coordinate(x-1,y)
                ]
            default:
                return [
                    new Coordinate(x-1,y-1),
                    new Coordinate(x,y-1),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y+1),
                    new Coordinate(x-1,y)
                ]
        }
    default :
        switch(y) {
            case 0:
                return [
                    new Coordinate(x+1,y),
                    new Coordinate(x+1,y+1),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y+1),
                    new Coordinate(x-1,y)
                ]
            case yDim: 
                return [
                    new Coordinate(x-1,y-1),
                    new Coordinate(x,y-1),
                    new Coordinate(x+1,y-1),
                    new Coordinate(x+1,y),
                    new Coordinate(x-1,y)
                ]
            default:
                return [
                    new Coordinate(x-1,y-1),
                    new Coordinate(x,y-1),
                    new Coordinate(x+1,y-1),
                    new Coordinate(x+1,y),
                    new Coordinate(x+1,y+1),
                    new Coordinate(x,y+1),
                    new Coordinate(x-1,y+1),
                    new Coordinate(x-1,y)
                ]

        }
    }
}

let xPos = 0
let yPos = 0
let xDim = data.length - 1
let yDim = data[0].length - 1
let risksTaken : ScoredCoordinate [] = []
while (xPos != xDim && yPos != yDim) {
    console.log (xPos, yPos)
    let neighbors = getValidNeighbours(xPos, yPos, xDim, yDim)
    let risks =
        neighbors
            .map(n =>
                new ScoredCoordinate(n.X, n.Y, data[n.X][n.Y])
            )

    console.log(risks)

    let sortedMoves = 
        risks
            .sort((a,b) => a.Risk - b.Risk)
            .filter((c) => c.X != xPos && c.Y != yPos)
    
    let bestMove = sortedMoves[0]

    xPos = bestMove.X
    yPos = bestMove.Y

    risksTaken.push(bestMove)
}
console.log(risksTaken.reduce((acc, r) => acc + r.Risk, 0 ))