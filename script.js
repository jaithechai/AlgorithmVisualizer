// script.js
let array = [];
let isStopped = false; // Variable to track if sorting should stop
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
document.getElementById('stopBtn').addEventListener('click', stopVisualization); // Stop button event

function randomizeArray() {
    const size = parseInt(arraySizeInput.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    isStopped = false; // Reset stop flag when randomizing
    drawArray();
}

function drawArray(highlightIndex = -1) {
    visualizationDiv.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = value * 3 + 'px'; // Scale bar height
        bar.style.backgroundColor = (index === highlightIndex) ? '#ffffff' : getBarColor(); // Highlight color for the current index
        visualizationDiv.appendChild(bar);
    });
}

function getBarColor() {
    const algorithm = document.getElementById('algorithmSelect').value;
    switch (algorithm) {
        case 'bubbleSort':
            return '#3498db'; // Blue for Bubble Sort
        case 'quickSort':
            return '#9b59b6'; // Purple for Quick Sort
        case 'mergeSort':
            return '#e74c3c'; // Red for Merge Sort
        default:
            return '#3498db'; // Default color
    }
}

async function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    isStopped = false; // Reset stop flag before starting
    if (algorithm === 'bubbleSort') {
        await bubbleSort(array);
    } else if (algorithm === 'quickSort') {
        await quickSort(array, 0, array.length - 1);
    } else if (algorithm === 'mergeSort') {
        await mergeSort(array, 0, array.length - 1);
    }
}

// Function to stop the sorting
function stopVisualization() {
    isStopped = true; // Set stop flag to true
}

// Example Bubble Sort Algorithm
async function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len && !isStopped; i++) {
        for (let j = 0; j < len - 1 && !isStopped; j++) {
            drawArray(j); // Highlight the current bar being compared
            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                drawArray(j); // Highlight the current bar being swapped
                await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
            }
        }
    }
}

// Example Quick Sort Algorithm
async function quickSort(arr, left, right) {
    if (left < right && !isStopped) {
        const pivotIndex = await partition(arr, left, right);
        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    }
    drawArray(); // Update visualization
}

async function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right && !isStopped; j++) {
        drawArray(j); // Highlight the current bar being compared
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            drawArray(i); // Highlight the current bar being swapped
            await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    drawArray(i + 1); // Highlight the pivot
    return i + 1;
}

// Example Merge Sort Algorithm
async function mergeSort(arr, left, right) {
    if (left < right && !isStopped) {
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

    while (i < leftArr.length && j < rightArr.length && !isStopped) {
        drawArray(k); // Highlight the current index being written
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        k++;
    }

    while (i < leftArr.length && !isStopped) {
        arr[k] = leftArr[i];
        drawArray(k); // Highlight the current index being written
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        i++;
        k++;
    }

    while (j < rightArr.length && !isStopped) {
        arr[k] = rightArr[j];
        drawArray(k); // Highlight the current index being written
        await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
        j++;
        k++;
    }
}
