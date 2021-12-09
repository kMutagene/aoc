import * as fs from 'fs';

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day7/input.txt", 'utf8')
    .replace("\n","")
    .split(",")
    .map(entry => parseInt (entry))

//part1
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

let optimalHorizontalPosition = median(data)

let consumedFuel =  
    data
    .map((hp) => {
        return Math.abs(hp-optimalHorizontalPosition)
    })
    .reduce((a,b) => a + b)

console.log(consumedFuel)

//part2

const mean = (values:number[]) => {
    let sum =
    values
        .reduce((prev,current) => prev+current)
    return sum / values.length
}

let optimalHorizontalPosition2 = mean(data)
let lowerMean = Math.floor(optimalHorizontalPosition2) 
let upperMean = Math.ceil(optimalHorizontalPosition2) 

let consumedFuelUpper =
    data
    .map((hp) => {
        let distance = Math.abs(hp-upperMean)
        let fuelConsumption = 0
        for (let i = 1; i <= distance; i++) {
            fuelConsumption = fuelConsumption + i
        }
        return fuelConsumption
    })
    .reduce((a,b) => a + b)

let consumedFueLower =
    data
    .map((hp) => {
        let distance = Math.abs(hp-lowerMean)
        let fuelConsumption = 0
        for (let i = 1; i <= distance; i++) {
            fuelConsumption = fuelConsumption + i
        }
        return fuelConsumption
    })
    .reduce((a,b) => a + b)


console.log(Math.min(consumedFuelUpper, consumedFueLower))