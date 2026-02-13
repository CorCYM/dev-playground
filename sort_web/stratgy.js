function* shuffleGenerator(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { array: [...arr], compareIndexes: [i, j] };
    }
}

function* accentGenerator(arr) {
    for (let i =0; i < arr.length; i++) {
        yield { array: [...arr], swappedIndexes: [i]};
    }
    yield { array: [...arr]};
}

