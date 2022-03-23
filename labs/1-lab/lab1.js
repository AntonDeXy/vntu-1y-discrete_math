const isCombinationAlreadyShown = (code) => {
    const usedLetters = coveredCombinationsLetters.map(l => l.split(''))
    const lettersToCheck = code.split('')

    return usedLetters.find((usedSet) => {
        return usedSet.every(set => lettersToCheck.includes(set))
    })
}

const getPermutations = (array, size) => {
    function p(t, i) {
        if (t.length === size) {
            result.push(t);
            return;
        }
        if (i + 1 > array.length) {
            return;
        }
        p(t.concat(array[i]), i + 1);
        p(t, i + 1);
    }

    const result = [];
    p([], 0);
    return result;
}

const checkIsCovered = (rows) => {
    const cover = []

    rows.forEach(row => {
        row.forEach((value, index) => {
            if (!cover[index]) {
                cover[index] = value
            }
        })
    })

    return cover.every((value) => value)
}

const prices = [ 4, 2, 1, 1, 2, 3, 1 ]

const mat = [
    [1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1],
]

const letters = ["A", "B", "C", "D", "E", "F", "G"].slice(0, mat.length)
const combinations = []


for(let i = 1; i <= letters.length + 1; i++) {
    const tempCombinations = getPermutations(letters, i).map(comb => comb.join(''));

    combinations.push(...tempCombinations)
}

const sortedCombinations = combinations.sort((a, b) => a.length - b.length)

const combinationsOfRowIndexes = []
sortedCombinations.forEach((item) => {
    const indexesOfRows = item.split('').map(i => letters.findIndex((letter) => letter === i))

    combinationsOfRowIndexes.push(indexesOfRows)
})

const combinedRows = combinationsOfRowIndexes.map(item => {
    return item.map(index => mat[index])
})

const coveredCombinationsLetters = []

const getCombinationPrice = (code) => {
    const selectedLetters = code.split('')
    const priceIndexes = selectedLetters.map(l => letters.findIndex(l2 => l2 == l))

    const price = priceIndexes.reduce((acc, price) => acc + prices[price], 0)

    return price
}

let theShortestCover = null
let theCheapestCover = null

// output values
combinedRows.forEach((combination, index) => {
    const combinationCode = sortedCombinations[index]
    const isPartAlreadyUsed = isCombinationAlreadyShown(combinationCode)
    const isAcceptableComb = checkIsCovered(combination)
    const price = getCombinationPrice(combinationCode)
    
    const overCoverText = `- over-cover (${isPartAlreadyUsed?.join('')}); price ${price}`

    const coverStatusText = isAcceptableComb ? `+ ${price}` : '-'

    const additionalCombText = isPartAlreadyUsed ? overCoverText : coverStatusText

    console.log(combinationCode, additionalCombText)
    
    if (isAcceptableComb) {
        if (!theShortestCover) theShortestCover = {code: combinationCode, combination, price: price}
        if (!theCheapestCover || theCheapestCover.price > price) {
            theCheapestCover = {code: combinationCode, combination, price}
        }

        coveredCombinationsLetters.push(combinationCode)
    }
})

console.log("The shortest cover", theShortestCover?.code)
console.log("The cheapest cover", theCheapestCover?.code + " " + theCheapestCover?.price)