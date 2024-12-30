class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (
        this.getPriorityValue(this.heap[parentIndex].priority) >=
        this.getPriorityValue(this.heap[index].priority)
      ) {
        break;
      }
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }

  heapifyDown(index) {
    const length = this.heap.length;
    let largest = index;
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;

    if (
      leftChild < length &&
      this.getPriorityValue(this.heap[leftChild].priority) >
        this.getPriorityValue(this.heap[largest].priority)
    ) {
      largest = leftChild;
    }

    if (
      rightChild < length &&
      this.getPriorityValue(this.heap[rightChild].priority) >
        this.getPriorityValue(this.heap[largest].priority)
    ) {
      largest = rightChild;
    }

    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index],
      ];
      this.heapifyDown(largest);
    }
  }

  insert(task) {
    this.heap.push(task);
    this.heapifyUp(this.heap.length - 1);
  }

  delete() {
    if (this.heap.length === 0) return null;
    const highestPriorityTask = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return highestPriorityTask;
  }

  top() {
    return this.heap[0] || null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
  getPriorityValue(priority) {
    const priorities = { High: 3, Med: 2, Low: 1 };
    return priorities[priority] || 0;
  }
}

export { PriorityQueue };
