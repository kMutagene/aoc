import * as fs from 'fs';

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day9/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map((row) => {
        return (
            row
            .split("")
            .map((height) => {return parseInt(height)})
        )
    })

console.log(data)

class Tile {
    R:number
    C:number
    H: number

    constructor(r: number,c: number, h:number) {
        this.R = r
        this.C = c
        this.H = h
    }
}

let basinFloors : Tile[] = []

data
.map((row,rowIndex) => {
    row.map((height,colIndex) => {
        if (rowIndex === 0) {
            if (colIndex === 0) {
                if (data[rowIndex + 1][colIndex] > height && data[rowIndex][colIndex + 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else if (colIndex === row.length - 1) {
                if (data[rowIndex + 1][colIndex] > height && data[rowIndex][colIndex - 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else {
                if (data[rowIndex][colIndex - 1] > height && data[rowIndex][colIndex + 1] > height && data[rowIndex + 1][colIndex] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            }
        } else if (rowIndex === data.length - 1) {
            if (colIndex === 0) {
                if (data[rowIndex - 1][colIndex] > height && data[rowIndex][colIndex + 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else if (colIndex === row.length - 1) {
                if (data[rowIndex - 1][colIndex] > height && data[rowIndex][colIndex - 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else {
                if (data[rowIndex][colIndex - 1] > height && data[rowIndex][colIndex + 1] > height && data[rowIndex - 1][colIndex] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            }
        } else {
            if (colIndex === 0) {
                if (data[rowIndex - 1][colIndex] > height && data[rowIndex + 1][colIndex] > height && data[rowIndex][colIndex + 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else if (colIndex === row.length - 1) {
                if (data[rowIndex - 1][colIndex] > height && data[rowIndex + 1][colIndex] > height && data[rowIndex][colIndex - 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            } else {
                if (data[rowIndex - 1][colIndex] > height && data[rowIndex + 1][colIndex] > height && data[rowIndex][colIndex + 1] > height && data[rowIndex][colIndex - 1] > height) {basinFloors.push (new Tile(rowIndex,colIndex,height))}
            }
        }
    })
})

const calcRiskFactor = (basinFloors: Tile []) => {
    return(
        basinFloors
        .map(b => {return b.H + 1})
        .reduce((a,b) => a + b)
    )
}

console.log(calcRiskFactor(basinFloors))

let allTiles =
    data
    .map ((row,r) => {
        return(
            row.map((h,c) => {
                return new Tile(r,c,h)
            })
        )
    })

const getNeighbours = (tiles: Tile[][], tile: Tile) => {
    if (tile.R === 0) {
        if (tile.C === 0) {
            return [tiles[tile.R + 1][tile.C] , tiles[tile.R][tile.C + 1]]
        } else if (tile.C === tiles[0].length - 1) {
            return [tiles[tile.R + 1][tile.C] , tiles[tile.R][tile.C - 1] ]
        } else {
            return [tiles[tile.R][tile.C - 1] , tiles[tile.R][tile.C + 1] , tiles[tile.R + 1][tile.C]]
        }
    } else if (tile.R === tiles.length - 1) {
        if (tile.C === 0) {
            return [tiles[tile.R - 1][tile.C], tiles[tile.R][tile.C + 1]]
        } else if (tile.C === tiles[0].length - 1) {
            return [tiles[tile.R - 1][tile.C], tiles[tile.R][tile.C - 1]]
        } else {
            return [tiles[tile.R][tile.C - 1], tiles[tile.R][tile.C + 1], tiles[tile.R - 1][tile.C]]
        }
    } else {
        if (tile.C === 0) {
            return [tiles[tile.R - 1][tile.C] , tiles[tile.R + 1][tile.C] , tiles[tile.R][tile.C + 1]  ]
        } else if (tile.C === tiles[0].length - 1) {
            return [tiles[tile.R - 1][tile.C] , tiles[tile.R + 1][tile.C] , tiles[tile.R][tile.C - 1] ]
        } else {
            return [tiles[tile.R - 1][tile.C] , tiles[tile.R + 1][tile.C] , tiles[tile.R][tile.C + 1] , tiles[tile.R][tile.C - 1] ]
        }
    }
}

const growBasin = (tiles: Tile[][], tile: Tile) => {
    let tmp = new Set<Tile>()
    const loop = (tiles: Tile[][], tile: Tile) => { 
        let neighbours = getNeighbours(tiles,tile)
        //console.log(neighbours)
        let nonBorderTiles =
            neighbours.filter((tile) => tile.H != 9)
        //console.log(nonBorderTiles)
        let currentBasinSize = tmp.size
        nonBorderTiles.map((tile) => {
            tmp.add(tile)
        })
        if (tmp.size != currentBasinSize) {
            //console.log("yes")
            nonBorderTiles
            .map((nbt) => {
                loop(tiles,nbt)
            })
        }
    }
    loop(tiles,tile)
    return tmp
}

let basins =
    basinFloors
    .map((tile) => {return growBasin(allTiles,tile)})

console.log(
    basins
    .map((a) => {return a.size})
    .sort((a,b) => a - b)
    .reverse()
    .slice(0,3)
    .reduce((a,b) => a * b)
)

// //part2
// var plotly = require('plotly')("kMutagene", "nope")

// var pltData = {
//     z: data,
//     type: "heatmap"
// }
// var layout = {fileopt : "overwrite", filename : "aoc_day9"};

// plotly.plot(pltData, layout, function (err: any, msg: any) {
//     if (err) return console.log(err);
// 	console.log(msg);
// });

