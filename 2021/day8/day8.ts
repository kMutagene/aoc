import * as fs from 'fs';
const data =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day8/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map(entry => {
        return(
            entry
            .split(" | ")[1]
            .split(" ")
        )
    })
let count =
    data
    .map (entry => {
        return(
            entry
            .filter(number =>{
                // 1; 4; 7; 8
                return number.length === 2 || number.length === 4 || number.length === 3 || number.length === 7
            }).length
        )
    })
    .reduce ((prev,current) => prev+current)
console.log(count)

//part2
const inputs =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day8/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map(entry => {
        return(
            entry
            .split(" | ")[0]
            .split(" ")
            .map (digit => new Set (digit))
        )
    })
const outputs =
    fs.readFileSync("C:/Users/schne/source/repos/kMutagene/aoc2021/day8/input.txt", 'utf8')
    .split("\n")
    .slice(0,-1)
    .map(entry => {
        return(
            entry
            .split(" | ")[1]
            .split(" ")
            .map (digit => new Set (digit))
        )
    })
const difference = (setA: Set<string>, setB: Set<string>) => {
        var _difference = new Set(setA)
        for (var elem of setB) {
            _difference.delete(elem)
        }
        return _difference
}
const union = (setA: Set<string>, setB: Set<string>) => {
    var _union = new Set(setA)
    for (var elem of setB) {
        _union.add(elem)
    }
    return _union
}
const isSuperset = (set: Set<string>, subset: Set<string>) => {
    for (var elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}
const eqSet = (as: Set<string>, bs: Set<string>) => {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}
const assignNumbers = (sets: Set<string>[]) => {
    let one = sets.find(set => set.size === 2) as Set<string>
    let four = sets.find(set => set.size === 4) as Set<string>
    let seven = sets.find(set => set.size === 3) as Set<string>
    let eight = sets.find(set => set.size === 7) as Set<string>
    let length5 = sets.filter(set => set.size === 5)
    let length6 = sets.filter(set => set.size === 6)
    //let segmentA = difference(seven,one)
    let segmentBD = difference(four,seven)
    let five = length5.find(set => isSuperset(set,segmentBD)) as Set<string>
    length5 = length5.filter(set => !(eqSet (set,five)))
    let segmentC = difference(one,five)
    let six = length6.filter(set => !isSuperset(set,segmentC))[0]
    length6 = length6.filter(set => !(eqSet (set,six)))
    let segmentE = difference(six,five)
    let nine = length6.find(set => isSuperset(set,segmentBD)) as Set<string>
    length6 = length6.filter(set => !(eqSet (set,nine)))
    let zero = length6[0]
    let two = length5.find(set => isSuperset(set,segmentE)) as Set<string>
    length5 = length5.filter(set => !(eqSet (set,two)))
    let three = length5[0]
    return (
    {
        One: one,
        Two: two,
        Three: three,
        Four: four,
        Five: five,
        Six: six,
        Seven: seven,
        Eight: eight,
        Nine: nine,
        Zero: zero
    })
}
const decode = (inputs: Set<string>[],outputs: Set<string>[]) => {
    let assigned = assignNumbers (inputs)
    return(
        outputs
        .map(set =>{
            if (eqSet(set,assigned.One)) {return 1}
            else if (eqSet(set,assigned.Two)) {return 2}
            else if (eqSet(set,assigned.Three)) {return 3}
            else if (eqSet(set,assigned.Four)) {return 4}
            else if (eqSet(set,assigned.Five)) {return 5}
            else if (eqSet(set,assigned.Six)) {return 6}
            else if (eqSet(set,assigned.Seven)) {return 7}
            else if (eqSet(set,assigned.Eight)) {return 8}
            else if (eqSet(set,assigned.Nine)) {return 9}
            else if (eqSet(set,assigned.Zero)) {return 0}
        })
    )
}
let res =
    outputs
    .map((set,index) => {
        return parseInt(decode(inputs[index],set).join(""))
    })
    .reduce((prev,current) => prev+current)
console.log(res)