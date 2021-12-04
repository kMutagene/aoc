import * as fs from 'fs';
const data =
    fs.readFileSync('C:/Users/schne/source/repos/kMutagene/aoc2021/day3/input.txt', 'utf8')
    .split("\n")
    .slice(0,-1)
    .map(line => line.split(""))

let transposed = data[0].map((_, colIndex) => data.map(row => row[colIndex]))

let gammaRateBinary: string[] = []
let epsilonRateBinary: string[] = []

transposed
    .map((set) => {
        let length1 = set.filter(element => element === '1').length
        if ((set.length/2) > length1) {
            gammaRateBinary.push('0')
            epsilonRateBinary.push('1')
        } 
        else {
            gammaRateBinary.push('1')
            epsilonRateBinary.push('0')
        }
    })

let gammaRate = parseInt(gammaRateBinary.join(""),2)
let epsilonRate = parseInt(epsilonRateBinary.join(""),2)

console.log(`${gammaRate}, ${epsilonRate}, ${gammaRate*epsilonRate}`)