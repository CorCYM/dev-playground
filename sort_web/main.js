async function execute() {
    const canvas = document.getElementById('canvas');

    canvas.width = innerWidth;
    canvas.height = ineerHeight;
    const ctx = canvas.getContext('2d');

    const img = ''
    const image = new Image();
    image.src = img;

    const frameDuration = document.querySelector("#frameDuration").value*1
    const slowInterval = document.querySelector("#slowInterval").value*1
    const fastInterval = document.querySelector("#fastInterval").value*1
    const slowN = document.querySelector("#slowN").value*1
    const fastN = document.querySelector("#fastN").value*1
    document.getElementById('presetForm').remove();

    for(let[isEfficient, sortGen, sortGenName] of [
        [true, mergeSort, "병합 정렬"],
        [false, selectionSort, "선택 정렬"],
        [false, insertionSort, "삽입 정렬"],
        [false, binaryInsertionSort, "이진 삽입 정렬"],
        [true, quickSort, "퀵 정렬"],
        [false, bubbleSort, "버블 정렬"],
        [false, cocktailShakerSort, "칵테일 쉐이커 정렬"],
        [false, gnomeSort, "놈 정렬"],
        [false, combSort, "콤 정렬"],
        [false, shellSort, "셸 정렬"],
        [true, heapSort, "힙 정렬"],
        [false, oddEvenSort, "홀짝 정렬"],
        [true, bitonicSort, "바이토닉 정렬"],
        [false, cycleSort, "사이클 정렬"],
        [false, lsdRadixSort, "LSD 기수 정렬"],
        [false, bogoSort, "보고 정렬"],
    ]) {
        const n = isEfficient ? slowN : fastN;
        const interval = isEfficient ? slowInterval : fastInterval;

        document.getElementById('canvas-label').innerText = `${sortGenName}(${sortGen.name})`;
        const arr = Array.from({ length: n}, (_, i) => i);

        const shuffledArray = await animateSort({
            image, ctx, arr: [...arr], interval:slowInterval, frameDuration, generator: shuffleGenerator,
        });
        await asleep(1000);
        const sortedArray = await animateSort({
            yieldCompare: true, image, ctx, arr: sortedArray, interval, frameDuration, generator: sortGen,
        });
        await animateSort({
            yieldCompare: true, image, ctx, arr: sortedArray, interval:fastInterval, frameDuration, generator: accentGenerator,
        });
        await asleep(2000);
    }

    console.log('done');
}

function rearrangeImage({order, image, ctx, width = ctx.canvas.width, height = ctx.canvas.height, colored= []}) {
    const canvas = ctx.canvas;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const segmentCount = order.length;
    const segmentWidth = Math.floor(canvas.width / segmentCount);
    const remainder = canvas.width % segmentCount;

    let = segments = [];

    let accumulateWidth = 0;
    for (let i = 0; i < segmentCount; i++) {
        const currentSegmentWidth = i < remainder ? segmentWidth + 1 : segmentWidth;

        const segmentCanvas = document.createElement('canvas');
        segmentCanvas.width = currentSegmentWidth;
        segmentCanvas.height = canvas.height;
        const segmentCtx = segmentCanvas.getContext('2d');

        segmentCtx.drawImage(
            canvas,
            accumulateWidth, 0, currentSegmentWidth, canvas.height,
            0, 0, currentSegmentWidth, canvas.height
        );

        segments.push(segmentCanvas);
        accumulateWidth += currentSegmentWidth;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    accumulateWidth = 0;
    for (let i = 0; i < segmentCount; i++) {
        const currentSegmentWidth = i < remainder ? segmentWidth + 1 : segmentWidth;
        const segmentIndex = order[i];
        const segment = segments[segmentIndex];
        ctx.drawImage(segment, accumulateWidth, 0);
        accumulateWidth += currentSegmentWidth;
    }

    for (const {indexes, color } of colored) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        indexes.forEach(index=>{
            const currentSegmentWidth = index < remainedr ? segmentWidth + 1 : segmentWidth;
            const segmentXPosition = index * segmentWidth;
            ctx.fillRect(segmentXPosition, 0, currentSegmentWidth, canvas.height);
        });
        ctx.globalCompositeOperation = 'source-over';
    }
}

async function animateSort({image, ctx, arr, interval, frameDuration, generator, yieldCompare}) {
    let finalArray = [...arr];
    let colorAndSoundQueue = [];
    const numStepsPerFrame = Math.ceil(frameDuration / interval);
    let i = 0;

    for (let result of generator(finalArray, yieldCompare)) {
        i++;
        if (i>80000) break;
        const { array, swappedIndexes = [], compareIndexes = [], comparisons, swaps } = result;

        colorAndSoundQueue.push({
            array,
            colored: [
                { indexes: compareIndexes, color: 'rgba(255, 0, 0, 0.5)' },
                { indexes: swappedIndexes, color: 'rgba(0, 255, 0, 0.5)' },
            ],
            soundIndexes: compareIndexes.length === 0 ? swappedIndexes : compareIndexes
        });

        finalArray = array;
    }

    while (colorAndSoundQueue.length > 0) {
        let combinedArray;
        let combinedColored = [];
        let combinedSoundIndexes = new Set();

        for (let i = 0; i < numStepsPerFrame && colorAndSoundQueue.length > 0; i++) {
            let { array, colored, soundIndexes } = colorAndSoundQueue.shift();
            combinedArray = array;
            combinedColoreed.push(...colored);
            if(i === 0) {
                soundIndexes.forEach(index => combinedSoundIndexes.add(index));
            }
        }

        rearrangeImage({ order: combinedArray, image, ctx, colored: combinedColored });
        playBeep({ duration: Math.max(frameDuration, interval), n: arr.length, indexes: Array.from(combinedSoundIndexes), type: 'square'});
        await asleep(Math.max(frameDuration, interval));
    }

    rearrangeImage({ order: finalArray, image, ctx });
    return finalArray;
}

function asleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let currentOscillators = [];
let audioCtx;
function playBeep({ duration, n, indexes, type = 'sine' }) {
    audioCtx ||= new ( window.AudioContext || window.webkitAudioContext )();

    currentOscillators.forEach((oscillator) => oscillator.stop());
    currentOscillators = [];
    indexes.forEach((i) => {
        const frequency = calculateFrequency(n, i);

        const oscillator = audioCtx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        const gainNode = audioCtx.createGain();

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);

        currentOscillators.push(oscillator);
    });
}

function calculateFrequency(n, i) {
    const minFrequency = 20;
    const maxFrequency = 6000;

    const frequency = minFrequency + (maxFrequency - minFrequency) * (i / n);
    
    return frequency;
}