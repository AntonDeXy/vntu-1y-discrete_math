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

const getMinColumnIndex = () => {

    const countOnesPerColumn = []

    for (let i = 0; i < mat.length; i++) {
        let onesCount = 0
        mat.forEach(row => row[i] && onesCount++)
    
        countOnesPerColumn.push(onesCount)
    }
    
    const theBiggestCountOfOnesPerColumn = countOnesPerColumn.sort((a, b) => b - a)[0]
    
    const indexOfColumnWithBiggestOnesCount = countOnesPerColumn.findIndex(onesCount => onesCount === theBiggestCountOfOnesPerColumn)
    
    return indexOfColumnWithBiggestOnesCount
}

const getMaxRowIndex = () => {
    const rowsIncludeOneOnCrossingWithSelectedColumn = mat.map((row, index) => ({data: row, index})).filter(row => row.data[minColumnIndex])

    const rowWithMaxOnesCount = rowsIncludeOneOnCrossingWithSelectedColumn.sort((a,b) => getOnesPerRowCount(b.data) - getOnesPerRowCount(a.data))[0]
    
    return rowWithMaxOnesCount.index
}

const getOnesPerRowCount = (row) => {
    return row.reduce((acc, item) => item ? acc + 1 : acc, 0)
}

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

const rowsCount = mat.length

const minColumnIndex = getMinColumnIndex()

const maxRowIndex = getMaxRowIndex(minColumnIndex)

const selectedRowLetter = letters[maxRowIndex]

console.log('column with min ones count:', minColumnIndex + 1)
console.log('row with max ones count:', maxRowIndex + 1)

const combinations = []


for(let i = 1; i <= letters.length + 1; i++) {
    const tempCombinations = getPermutations(letters, i).map(comb => comb.join(''));

    combinations.push(...tempCombinations)
}

const sortedCombinations = combinations.filter(combination => combination.includes(selectedRowLetter)).sort((a, b) => a.length - b.length)

const combinationsOfRowIndexes = []

sortedCombinations.forEach((item) => {
    const indexesOfRows = item.split('').map(i => letters.findIndex((letter) => letter === i))

    combinationsOfRowIndexes.push(indexesOfRows)
})

const combinedRows = combinationsOfRowIndexes.map(item => {
    return item.map(index => mat[index])
})

let firstAcceptableCombination = ""
let iteratedCombinationsCount = 0

while (!firstAcceptableCombination) {
    if (checkIsCovered(combinedRows[iteratedCombinationsCount])) {
        firstAcceptableCombination = sortedCombinations[iteratedCombinationsCount]
    }

    iteratedCombinationsCount++
}

console.log('acceptable cover: ', firstAcceptableCombination)