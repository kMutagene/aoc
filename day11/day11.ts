import * as Util from 'util'
import * as fs from 'fs'


class DumboOctopus {
    R: number
    C: number
    EnergyLevel : number
    HasFlashed  : boolean
    Flashs: number
    
    constructor(r: number, c: number, energyLevel: number, hasFlashed: boolean) {
        this.C = c
        this.R = r
        this.EnergyLevel = energyLevel
        this.HasFlashed  = hasFlashed    
        this.Flashs = 0
    }
}

var logGrid = function(rows:DumboOctopus[][]) {
    process.stdout.cursorTo(0, 0);
    rows
    .map((row) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        row.map((octopus) => {
            if (octopus.EnergyLevel === 0) {
                process.stdout.write(Util.format('\x1b[36m%s\x1b[0m',octopus.EnergyLevel))
            } else {
                process.stdout.write(octopus.EnergyLevel.toString())
            }
        })
        process.stdout.write('\n');
    })
};

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day11/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map((row) => {
        return (
            row
            .split("")
        )
    })
    .map((row, rowIndex) => {
        return (
            row.map((el, colIndex) => {return new DumboOctopus(rowIndex, colIndex, parseInt(el),false)})
        )
    })


const getNeighbours = (grid: DumboOctopus[][], octopus: DumboOctopus) => {
    if (octopus.R === 0) {
        if (octopus.C === 0) {
            return [grid[octopus.R + 1][octopus.C] , grid[octopus.R][octopus.C + 1], grid[octopus.R + 1][octopus.C + 1]]
        } else if (octopus.C === grid[0].length - 1) {
            return [grid[octopus.R + 1][octopus.C] , grid[octopus.R][octopus.C - 1], grid[octopus.R + 1][octopus.C - 1] ]
        } else {
            return [
                grid[octopus.R][octopus.C - 1], 
                grid[octopus.R][octopus.C + 1], 
                grid[octopus.R + 1][octopus.C],
                grid[octopus.R + 1][octopus.C + 1],
                grid[octopus.R + 1][octopus.C - 1]
            ]
        }
    } else if (octopus.R === grid.length - 1) {
        if (octopus.C === 0) {
            return [grid[octopus.R - 1][octopus.C], grid[octopus.R][octopus.C + 1], grid[octopus.R - 1][octopus.C + 1]]
        } else if (octopus.C === grid[0].length - 1) {
            return [grid[octopus.R - 1][octopus.C], grid[octopus.R][octopus.C - 1], grid[octopus.R - 1][octopus.C - 1]]
        } else {
            return [
                grid[octopus.R][octopus.C - 1], 
                grid[octopus.R][octopus.C + 1], 
                grid[octopus.R - 1][octopus.C],
                grid[octopus.R - 1][octopus.C + 1],
                grid[octopus.R - 1][octopus.C - 1]
            ]
        }
    } else {
        if (octopus.C === 0) {
            return [
                grid[octopus.R - 1][octopus.C], 
                grid[octopus.R + 1][octopus.C], 
                grid[octopus.R][octopus.C + 1],
                grid[octopus.R - 1][octopus.C + 1],
                grid[octopus.R + 1][octopus.C + 1]
            ]
        } else if (octopus.C === grid[0].length - 1) {
            return [
                grid[octopus.R - 1][octopus.C], 
                grid[octopus.R + 1][octopus.C], 
                grid[octopus.R][octopus.C - 1],
                grid[octopus.R - 1][octopus.C - 1],
                grid[octopus.R + 1][octopus.C - 1]
            ]
        } else {
            return [
                grid[octopus.R - 1][octopus.C], 
                grid[octopus.R + 1][octopus.C], 
                grid[octopus.R][octopus.C + 1], 
                grid[octopus.R][octopus.C - 1],
                grid[octopus.R - 1][octopus.C + 1],
                grid[octopus.R + 1][octopus.C + 1],
                grid[octopus.R - 1][octopus.C - 1],
                grid[octopus.R + 1][octopus.C - 1]
            ]
        }
    }
}

const getFlashers = (grid:DumboOctopus[][]) => {
    let canFlash: DumboOctopus [] = []
    grid
    .map((row) => {
        row.map(octopus => {
            if ((octopus.EnergyLevel > 9) && (octopus.HasFlashed != true)) {
                //console.log(octopus)
                canFlash.push(octopus)
            }
        })
    })
    return canFlash
}

const increaseEnergy = (grid:DumboOctopus[][], flashers: DumboOctopus []) => {
    let tmp = grid
    flashers.map((flasher) => {
        let neighbours = getNeighbours(tmp,flasher)
        flasher.HasFlashed = true
        flasher.Flashs = flasher.Flashs + 1
        tmp[flasher.R][flasher.C] = flasher
        neighbours.map((octopus) => {
            octopus.EnergyLevel = octopus.EnergyLevel + 1
            tmp[octopus.R][octopus.C] = octopus
        })

    })
    return tmp
}


const isSynchronizedFlash = (grid:DumboOctopus[][],generation:number) => {
    let amountFlashed =
        grid
        .map(row => {
            return row.filter((o) => {
                return o.HasFlashed
            })
            .length
        })
        .reduce((a,b) => a+b)
    let allOctopi = 
        grid
        .map(row => row.length)
        .reduce((a,b) => a+b)
    if (amountFlashed === allOctopi) {
        return generation
    } else {
        return -1
    }
}

const octoGeneration = (grid:DumboOctopus[][],generation:number) => {
    grid.map((row) => {
        row.map ((o) => {
            o.EnergyLevel = o.EnergyLevel + 1
        })
    })
    let nextGen: DumboOctopus [][] = []
    let loop = (grid:DumboOctopus[][], flashers:DumboOctopus[])  => {
        if (flashers.length > 0) {
            let increased = increaseEnergy(grid,flashers)
            let newFlashers = getFlashers(increased)
            loop(increased,newFlashers)
        } else {
            let sync = isSynchronizedFlash(grid,generation)
            if (sync > 0) {
                console.log(`synced @ ${sync + 1}`)
            }
            nextGen =
                grid.map((row) => {
                    return row.map(octopus => {
                        if (octopus.HasFlashed) {
                            octopus.HasFlashed = false
                            octopus.EnergyLevel = 0
                        }
                        return octopus
                    })
                })
        }
    }
    loop(grid,getFlashers(grid))
    return nextGen
}

function sleep(ms:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const countFlashes = (grid:DumboOctopus[][]) => {
    return (
        grid
        .map(row => {
            return row.map((o) => {
                return o.Flashs
            })
        })
        .map ((row) => {return row.reduce((a,b) => a+b)})
        .reduce((a,b) => a+b)
    )
}



const octoLoop = (grid:DumboOctopus[][], generations:number) => {
    let currentGen = grid
    //logGrid(currentGen)
    
    for (let i = 0; i < generations; i++) {
        let nextGen = octoGeneration(currentGen,i)
        currentGen = nextGen
    }
    return currentGen
}
console.log(countFlashes(octoLoop(data,10000))) // 100 for part 1
