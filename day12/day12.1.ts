import * as fs from 'fs'
import Graph from 'graphology'
// import {allSimplePaths} from 'graphology-simple-path'
// import bfs from 'graphology-traversal'

const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day12/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map((row) => {
        return (
            row
            .split("-")
        )
    })
const graph = new Graph()
var nodes: Set<string> = new Set()
data
    .map (edge => {
        edge
            .map(node => {
                if (!graph.hasNode(node)) {
                    if (node === node.toUpperCase()) {
                        graph.addNode(node,{Type: 'Large'})
                    } else{
                        graph.addNode(node,{Type: 'Small'})
                    }
                }
            })
        graph.addUndirectedEdge(edge[0],edge[1])
    })
const elongatePath = (currentPath: string[]) => { 
    let neighbours = graph.neighbors(currentPath[currentPath.length - 1])
    let paths: string[][] = []
    neighbours
        .map(neighbour =>{
            let newPath = Object.assign([],currentPath)
            if (graph.getNodeAttribute(neighbour,'Type') === 'Small'){
                if (!new Set(currentPath).has(neighbour)) {
                    newPath.push(neighbour)
                }
            } else {
                newPath.push(neighbour)
            }
            if (newPath.length > currentPath.length){
                paths.push(newPath)
            }
        })
    return paths
}
const returnAllPaths = (currentPaths: string[][]): string[][] => {
    let newPaths: string[][] = []
    currentPaths
        .map(path => {
            if (!(path[path.length - 1] === 'end')){
                elongatePath(path)
                    .map(newPath => newPaths.push(newPath))
            } else {
                newPaths.push(path)
            }
        })
    let unfinishedPaths =
        newPaths
            .filter(path => {
                return !(path[path.length - 1] === 'end')
            })
    if (unfinishedPaths.length > 0) {
        return returnAllPaths(newPaths)
    } else {
        return newPaths
    }
}
console.log(returnAllPaths([['start']]).length)