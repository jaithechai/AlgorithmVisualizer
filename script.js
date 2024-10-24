let array = [];
let isStopped = false; // Variable to track if sorting should stop
const visualizationDiv = document.getElementById('visualization');
const arraySizeInput = document.getElementById('arraySize');
const speedInput = document.getElementById('speed');
const arraySizeValue = document.getElementById('arraySizeValue');
const speedValue = document.getElementById('speedValue');

// Update display values for size and speed inputs
arraySizeInput.addEventListener('input', () => {
    arraySizeValue.textContent = arraySizeInput.value;
});

speedInput.addEventListener('input', () => {
    speedValue.textContent = speedInput.value + 'ms';
});

// Event listeners for buttons
document.getElementById('randomizeBtn').addEventListener('click', randomizeArray);
document.getElementById('startBtn').addEventListener('click', startVisualization);
document.getElementById('stopBtn').addEventListener('click', stopVisualization);
document.getElementById('algorithmSelect').addEventListener('change', updateColors);

function randomizeArray() {
    const size = parseInt(arraySizeInput.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    isStopped = false; // Reset stop flag when randomizing
    drawArray();
}

function drawArray(highlightIndex = -1) {
    visualizationDiv.innerHTML = '';
    const containerWidth = visualizationDiv.clientWidth; // Get the width of the container
    const barWidth = Math.max(2, containerWidth / array.length); // Ensure minimum width for bars

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = barWidth + 'px'; // Set dynamic width
        bar.style.height = value * 3 + 'px'; // Scale bar height

        // Set colors
        if (index === highlightIndex) {
            bar.style.backgroundColor = '#ffffff'; // Highlight color for the current index
        } else {
            bar.style.backgroundColor = getBarColor(); // Color for the rest
        }

        visualizationDiv.appendChild(bar);
    });
}

// Set bar color based on the selected algorithm
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

// Update button and slider colors based on the selected algorithm
function updateColors() {
    const buttonColor = getBarColor(); // Get the color based on the selected algorithm
    const buttons = document.querySelectorAll('button');
    const sliders = document.querySelectorAll('input[type="range"]');

    // Update button colors
    buttons.forEach(button => {
        button.style.backgroundColor = buttonColor;
        button.style.color = '#fff'; // Set text color to white for better visibility
    });

    // Update slider colors
    sliders.forEach(slider => {
        slider.style.backgroundColor = buttonColor; // Update slider track color
        slider.style.color = '#fff'; // Optional: Set text color on sliders
    });
}

// Start sorting visualization
async function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    isStopped = false; // Reset stop flag before starting
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

// Stop the sorting
function stopVisualization() {
    isStopped = true; // Set stop flag to true
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
                await new Promise(resolve => setTimeout(resolve, speedInput.value)); // Delay
            }
        }
        drawArray(); // Update the array visualization after each outer loop iteration
    }
}

// Quick Sort Algorithm
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
