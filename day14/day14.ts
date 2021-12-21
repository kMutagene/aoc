import * as fs from 'fs'
const data =
fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day14/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)

let input = 
    data[0]
    .split("")

let patternz: Record<string,string[]> = {}

data
.slice(2)
.map(str => {
    let arr = str.split(" -> ")
    let splitStart = arr[0].split("")
    patternz[arr[0]] = [splitStart[0]+arr[1],arr[1]+splitStart[1]]
})

const windowed = (input: string[]) => {
    return(
        input
        .map((_,index) => {
            return input.slice(index, index+2)
        })
    )
}

const lööpz = (input: string[], steps: number) => {
    let eO: Record<string,number> = {}
    windowed(input)
    .map(entry => {
        let jEntry = entry.join("")
        if (eO[jEntry]) {
            eO[jEntry] = eO[jEntry] + 1
        } else {
            eO[jEntry] = 1
        }
    })
    for (let i=0; i < steps; i++) {
        let keys = Object.keys(eO)
        let currentEO: Record<string,number> = {}
        keys.map(key =>{
            let newInserts = patternz[key]
            if (newInserts){
                let patternCount = eO[key]
                if (eO[newInserts[0]]) {
                    if (currentEO[newInserts[0]]){
                        currentEO[newInserts[0]] = currentEO[newInserts[0]] + patternCount
                    } else {
                        currentEO[newInserts[0]] = patternCount
                    }
                } else {
                    if (currentEO[newInserts[0]]){
                        currentEO[newInserts[0]] = currentEO[newInserts[0]] + patternCount
                    } else {
                        currentEO[newInserts[0]] = patternCount
                    }
                }
                if (eO[newInserts[1]]) {
                    if (currentEO[newInserts[1]]){
                        currentEO[newInserts[1]] = currentEO[newInserts[1]] + patternCount
                    } else {
                        currentEO[newInserts[1]] = patternCount
                    }
                } else {
                    if (currentEO[newInserts[1]]){
                        currentEO[newInserts[1]] = currentEO[newInserts[1]] + patternCount
                    } else {
                        currentEO[newInserts[1]] = patternCount
                    }
                }
            } else {
                if (currentEO[key]){
                    currentEO[key] = currentEO[key] + eO[key]
                } else {
                    currentEO[key] = eO[key]
                }
            }
        })
        eO = currentEO
    }
    return eO
}
const countRecord = (r: Record<string,number>) => {
    let eO: Record<string,number> = {}
    Object.keys(r)
    .map(key => {
        let count = r[key]
        let firstL = key.split("")[0]
        if (eO[firstL]) {
            eO[firstL] = eO[firstL] + count
        } else {
            eO[firstL] = count
        }
    })
    return Math.max(...Object.values(eO)) - Math.min(...Object.values(eO))
}
console.log(countRecord(lööpz(input,40))) // 10 for part 1