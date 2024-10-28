let array = [];
let isStopped = false;
const visualizationDiv = document.getElementById('visualization');
const arraySizeInput = document.getElementById('arraySize');
const speedInput = document.getElementById('speed');

arraySizeInput.addEventListener('input', () => {
    updateArraySize();
});

document.getElementById('randomizeBtn').addEventListener('click', randomizeArray);
document.getElementById('startBtn').addEventListener('click', startVisualization);
document.getElementById('stopBtn').addEventListener('click', stopVisualization);
document.getElementById('algorithmSelect').addEventListener('change', updateColors);

function updateArraySize() {
    const maxSize = Math.floor(visualizationDiv.clientWidth / 5); 
    arraySizeInput.max = maxSize;
}

function randomizeArray() {
    const size = parseInt(arraySizeInput.value);
    array = Array.from({ length: size }, () => Math.floor((Math.random() + 0.001) * 100));
    isStopped = false;
    drawArray();
}

function drawArray(highlightIndex = -1) {
    visualizationDiv.innerHTML = '';
    const containerWidth = visualizationDiv.clientWidth;
    const barWidth = Math.max(2, containerWidth / array.length);

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = barWidth + 'px';
        bar.style.height = value * 3 + 'px';

        if (index === highlightIndex) {
            bar.style.backgroundColor = 'white'; 
        } else {
            bar.style.backgroundColor = getBarColor();
        }

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

function updateColors() {
    const buttonColor = getBarColor(); 
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.style.backgroundColor = buttonColor;
        button.style.color = '#fff';
    });

    document.documentElement.style.setProperty('--slider-track-color', buttonColor);
    document.documentElement.style.setProperty('--slider-thumb-color', buttonColor);
}

async function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    isStopped = false; 
    switch (algorithm) {
        case 'bubbleSort':
            await bubbleSort(array);
            break;
        case 'quickSort':
            await quickSort(array, 0, array.length - 1);
            break;
        case 'mergeSort':
            await mergeSort(array, 0, array.length - 1);
            break;
    }
}

function stopVisualization() {
    isStopped = true; 
}

// Bubble Sort Algorithm
async function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len && !isStopped; i++) {
        for (let j = 0; j < len - 1 && !isStopped; j++) {
            drawArray(j); // Highlight the current bar being compared
            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                drawArray(j); // Highlight the current bar being swapped
                await new Promise(resolve => setTimeout(resolve, 1001 - speedInput.value)); 
            }
        }
        drawArray(); 
    }
}

// Quick Sort Algorithm
async function quickSort(arr, left, right) {
    if (left < right && !isStopped) {
        const pivotIndex = await partition(arr, left, right);
        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    }
    drawArray(); 
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
            await new Promise(resolve => setTimeout(resolve, 1001 - speedInput.value)); 
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    drawArray(i + 1); 
    return i + 1;
}

// Merge Sort Algorithm
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
        drawArray(k); 
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        await new Promise(resolve => setTimeout(resolve, 1001 - speedInput.value));
        k++;
    }

    while (i < leftArr.length && !isStopped) {
        arr[k] = leftArr[i];
        drawArray(k); // Highlight the current index being written
        await new Promise(resolve => setTimeout(resolve, 1001 - speedInput.value)); 
        i++;
        k++;
    }

    while (j < rightArr.length && !isStopped) {
        arr[k] = rightArr[j];
        drawArray(k); // Highlight the current index being written
        await new Promise(resolve => setTimeout(resolve, 1001 - speedInput.value)); 
        j++;
        k++;
    }
}
