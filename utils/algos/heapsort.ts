// asc = maxheap, desc = minheap
type Order = 'asc' | 'desc';

const heapSort = (arr: any, property: string, order: Order = 'asc') => {
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, arr.length, i, property, order);
    }

    for (let i = arr.length - 1; i > 0; i--) {
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        heapify(arr, i, 0, property, order);
    }
}

const heapify = (arr: any, size: number, i: number, property: string, order: Order) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (order === 'asc') {
        if (l < size && arr[l][property] > arr[largest][property])
            largest = l;

        if (r < size && arr[r][property] > arr[largest][property])
            largest = r;
    } else {
        if (l < size && arr[l][property] < arr[largest][property])
            largest = l;

        if (r < size && arr[r][property] < arr[largest][property])
            largest = r;
    }

    if (largest != i) {
        let swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        heapify(arr, size, largest, property, order);
    }
}

export default heapSort;