// script.js
let array = [];
const visualizationDiv = document.getElementById('visualization');
const arraySizeInput = document.getElementById('arraySize');
const speedInput = document.getElementById('speed');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedValue = document.getElementById('speedValue');

arraySizeInput.addEventListener('input', () => {
    arraySizeValue.textContent = arraySizeInput.value;
});

speedInput.addEventListener('input', () => {
    speedValue.textContent = speedInput.value + 'ms';
});

document.getElementById('randomizeBtn').addEventListener('click', randomizeArray);
document.getElementById('startBtn').addEventListener('click', startVisualization);

function randomizeArray() {
    const size = parseInt(arraySizeInput.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    drawArray();
}

function drawArray() {
    visualizationDiv.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = value * 3 + 'px'; // Scale bar height
        visualizationDiv.appendChild(bar);
    });
}

async function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    if (algorithm === 'bubbleSort') {
        await bubbleSort(array);
    } else if (algorithm === 'quickSort') {
        await quickSort(array, 0, array.length - 1);
    } else if (algorithm === 'mergeSort') {
        await mergeSort(array, 0, array.length - 1);
    }
}

// Example Bubble Sort Algorithm
async function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                drawArray(); // Update visualization
                await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
            }
        }
    }
}

// Example Quick Sort Algorithm
async function quickSort(arr, left, right) {
    if (left < right) {
        const pivotIndex = await partition(arr, left, right);
        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    }
    drawArray(); // Update visualization
}

async function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            drawArray(); // Update visualization
            await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    drawArray(); // Update visualization
    return i + 1;
}

// Example Merge Sort Algorithm
async function mergeSort(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
}

async function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        drawArray(); // Update visualization
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        k++;
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        drawArray(); // Update visualization
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        i++;
        k++;
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        drawArray(); // Update visualization
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        j++;
        k++;
    }
}
