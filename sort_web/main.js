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

    ctx

}