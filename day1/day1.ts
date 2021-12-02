import * as fs from 'fs';

const data = 
    fs.readFileSync('C:/Users/schne/source/repos/kMutagene/aoc2021/day1/input.txt', 'utf8')
        .split("\n")

let count = 0

data.map((val,index) => {
    if (index > 0) {
        if (parseInt(val) > parseInt(data[index - 1])) {
            count++
        }
    }
})

console.log(count)