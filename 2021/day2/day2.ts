import * as fs from 'fs';

type Action = {
    Direction: string,
    Speed: number
}

const data = 
    fs.readFileSync('C:/Users/schne/source/repos/kMutagene/aoc2021/day2/input.txt', 'utf8')
    .split("\n")
    .map((action) => {
        let splt = action.split(" ")
            let res : Action=
                {
                    Direction: splt[0],
                    Speed: parseInt(splt[1])
                }
            return res
    })

let depth = 0
let horizontal = 0

//part1
data
.map((action) => {
    switch (action.Direction) {
        case "forward":
            horizontal += action.Speed
            console.log(`horizontal: ${horizontal}`)
            break
        case "up":
            depth -= action.Speed
            console.log(`depth: ${depth}`)
            break
        case "down":
            depth += action.Speed
            console.log(`depth: ${depth}`)
            break
        default:
            console.log(`lol? ${action.Direction}`)
            break
    }
})

console.log(`[PART1] depth: ${depth} horizontal: ${horizontal} hash:${depth*horizontal}`)


//part2
depth = 0
horizontal = 0
let aim = 0

data
.map((action) => {
    switch (action.Direction) {
        case "forward":
            horizontal += action.Speed
            depth += (aim*action.Speed)
            console.log(`horizontal: ${horizontal}`)
            console.log(`depth: ${depth}`)
            break
        case "up":
            aim -= action.Speed
            console.log(`aim: ${aim}`)
            break
        case "down":
            aim += action.Speed
            console.log(`aim: ${aim}`)
            break
        default:
            console.log(`lol? ${action.Direction}`)
            break
    }
})

console.log(`[PART2] depth: ${depth} horizontal: ${horizontal} hash:${depth*horizontal}`)
