import * as fs from 'fs'
import {Stack} from "stack-typescript"
const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day10/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map((row) => {
        return (
            row
            .split("")
        )
    })
class LineInfo {
    Corrupted: boolean
    CorruptionScore: number[]
    OpeningStack: Stack<string>
    constructor(c: boolean,cs: number[],o: Stack<string>){
        this.Corrupted = c
        this.CorruptionScore = cs
        this.OpeningStack = o
    }
}
const analyzeLine = (line: string[]) => {
    let openingBrackets = new Stack<string>()
    let acc: number[] = []
    line
    .map(bracket => {
        switch (bracket) {
            case '(': 
                openingBrackets.push('(')
                break
            case '[':
                openingBrackets.push('[')
                break
            case '{':
                openingBrackets.push('{')
                break
            case '<':
                openingBrackets.push('<')
                break
            case ')': {
                let opening = openingBrackets.pop()
                if (opening !== '(') {acc.push(3)}
                break
            }
            case ']':
                let opening = openingBrackets.pop()
                if (opening !== '[') {acc.push(57)}
                break
            case '}': {
                let opening = openingBrackets.pop()
                if (opening !== '{') {acc.push(1197)}
                break
            }
            case '>': {
                let opening = openingBrackets.pop()
                if (opening !== '<') {acc.push(25137)}
                break
            }
            default: console.log("lol?")
        }
    })
    return (
        new LineInfo((acc.length > 0), acc, openingBrackets)
    )
}
const completeLine = (lineInfo: LineInfo) => {
    let stack = lineInfo.OpeningStack
    let size = stack.size
    let completedBracket: number[] = []
    for (let i = 0; i < size; i++) {
        let currentBracket = stack.pop()
        switch (currentBracket) {
            case '(': 
                completedBracket.push(1)
                break
            case '[':
                completedBracket.push(2)
                break
            case '{':
                completedBracket.push(3)
                break
            case '<':
                completedBracket.push(4)
                break
            default: console.log("lol?")
        }
    }
    return (
        completedBracket
        .reduce((prev,curr) => curr+prev*5)
    )
}
const median = (values:number[]) => {
    if(values.length === 0) throw new Error("No inputs")
    values.sort(function(a,b){
        return a-b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2)
        return values[half];
    return (values[half - 1] + values[half]) / 2.0;
}

//part1
let res =
    data
    .map(line => {
        return (
            (analyzeLine(line))
        )
    })
    .filter (line => line.Corrupted)
    .map(line => line.CorruptionScore[0])
    .reduce((a,b) => a+b)

console.log(res) //271245

//part2
let res2 =
    data
    .map(line => {
        return (
            (analyzeLine(line))
        )
    })
    .filter (line => !line.Corrupted)
    .map(line => completeLine(line))

console.log(median (res2))