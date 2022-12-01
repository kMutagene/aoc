import * as fs from 'fs';

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day6/input.txt", 'utf8')
    .replace("\n","")
    .split(",")
    .map(entry => parseInt (entry))

const testData = 
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day6/testInput.txt", 'utf8')
    .replace("\n","")
    .split(",")
    .map(entry => parseInt (entry))

const createEmptyFishies: () => Record<number,number> = () => {
    return(
        {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0
        } 
    )
}
let fishies: Record<number,number> = createEmptyFishies()

for (let i = 0; i < 256; i++){ // 80 for part 1
    let currentFishies: Record<number,number> = createEmptyFishies()
    if (i === 0){
        data
            .map(entry =>{
                currentFishies[entry] = currentFishies[entry] + 1
            })
    } else{
        currentFishies = fishies
    }
    fishies = createEmptyFishies()
    fishies[0] = currentFishies[1]
    fishies[1] = currentFishies[2]
    fishies[2] = currentFishies[3]
    fishies[3] = currentFishies[4]
    fishies[4] = currentFishies[5]
    fishies[5] = currentFishies[6]
    fishies[6] = (currentFishies[7] + currentFishies[0])
    fishies[7] = currentFishies[8]
    fishies[8] = currentFishies[0]
}
console.log(Object.values(fishies).reduce((prev,current) => prev+current))
console.log(fishies)