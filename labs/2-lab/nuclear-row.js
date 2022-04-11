const getColumnByIndex = (matrix, index) => matrix.map(row => row[index])

const removeColumn = (matrix, index) => matrix.map(row => {
    row.splice(index, 1)
    return row
})

const findAndRemoveNuclearRows = (matrix) => {
    for (let i = 0; i < matrix[0].length; i++) {
        const currentColumn = getColumnByIndex(matrix, i)
        
        const currentColumnOnes = currentColumn.filter(item => item)

        if (currentColumnOnes.length === 1) {
            const nuclearRowIndex = currentColumn.findIndex(item => item === 1)

            matrix.splice(nuclearRowIndex, 1) // remove row
            matrix = removeColumn(matrix, i)
            i = 0
        }
    }
    
    return matrix
}

const findAndRemoveAntiNuclearRows = (matrix) => {
    for(let i = 0; i < matrix.length; i++) {
        const currentRow = matrix[i]

        const onesCount = currentRow.filter(item => item)

        if (!onesCount.length) {
            matrix.splice(i, 1)
            i=0
        }
    }
    
    return matrix
}

const removeConsumedRows = (matrix, markMatrixChanged) => {
    let wasRowRemoved = false
    

    for (let i = 0; i < matrix.length; i++) {
        if (matrix.length <= 1) return matrix
        if (wasRowRemoved) {
            i = 0
            wasRowRemoved = false
        }

        const currentRow = matrix[i]
        const indexesWithOnes = []
        currentRow.forEach((item, index) => item && indexesWithOnes.push(index))

        for (let j = i + 1; j < matrix.length; j++) {
            const nextRow = matrix[j]

            const nextRowOnesIndexes = []
            nextRow.forEach((item, index) => item && nextRowOnesIndexes.push(index))


            if (nextRowOnesIndexes.length < indexesWithOnes.length) {
                const isRowConsumedBySelected = nextRowOnesIndexes.every(indexWithOne => indexesWithOnes.includes(indexWithOne))

                if (isRowConsumedBySelected) {
                    console.log('row removed')
                    markMatrixChanged()
                    matrix.splice(j, 1)
                    wasRowRemoved = true
                    break
                }
            }
        }
    }


    return matrix
}

const removeConsumedColumns = (matrix, markMatrixChanged) => {
    let wasColumnRemoved = false


    for (let i = 0; i < matrix[0].length; i++) {
        const columnsCount = matrix[0].length

        if (columnsCount <= 1) return matrix
        if (wasColumnRemoved) {
            i = 0
            wasColumnRemoved = false
        }

        const currentColumn = getColumnByIndex(matrix, i)
        const indexesWithOnes = []
        currentColumn.forEach((item, index) => item && indexesWithOnes.push(index))

        for (let j = i + 1; j < columnsCount; j++) {
            const nextColumn = getColumnByIndex(matrix, j)

            const nextColumnOnesIndexes = []
            nextColumn.forEach((item, index) => item && nextColumnOnesIndexes.push(index))


            if (nextColumnOnesIndexes.length < indexesWithOnes.length) {
                const isColumnConsumedBySelected = nextColumnOnesIndexes.every(indexWithOne => indexesWithOnes.includes(indexWithOne))

                if (isColumnConsumedBySelected) {
                    console.log('column removed')
                    markMatrixChanged()
                    matrix = removeColumn(matrix, j)
                    wasColumnRemoved = true
                    break
                }
            }
        }
    }


    return matrix
}

const transformMatrix = (matrix) => {
    const markMatrixChanged = () => isMatrixWasChanged = true

    let isMatrixWasChanged = false
    let newMatrix = matrix
    

    do {
        isMatrixWasChanged = false

        const step1 = findAndRemoveNuclearRows(newMatrix)

        const step2 = findAndRemoveAntiNuclearRows(step1)
    
        const step3 = removeConsumedColumns(step2, markMatrixChanged)
    
        const step4 = removeConsumedRows(step3, markMatrixChanged)

        newMatrix = step4
        
    } while (isMatrixWasChanged)

    return newMatrix
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

const findShortestCoverage= () => {

    let coverCode = ''
    let i = 0
    
    do {
        const combinationCode = sortedCombinations[i]
        
        if (checkIsCovered(combinedRows[i]) && !coverCode) {
            coverCode = combinationCode
        }
        i++
    } while (!coverCode && i < combinedRows.length)

    return coverCode    
}

// start

const mat = [
    [1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1],
]


const transformedMatrix = transformMatrix(mat)

// find shortest cover

const letters = ["A", "B", "C", "D", "E", "F", "G"].slice(0, mat.length)

const rowsCount = mat.length

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

// output shortest cover
console.log(findShortestCoverage());