/**
 * Question Name: LRU Cache Implementation (LLD)
 * Target Companies: Meta, Amazon, Google
 * Difficulty: High (System Design perspective)
 */

/**
 * Hinglish Explanation:
 * LRU (Least Recently Used) cache humein batata hai ki jab cache full ho jaye, 
 * toh us element ko hatao jo sabse purana (least recent) use hua hai.
 * 
 * Logic:
 * 1. O(1) time complexity ke liye Hash-Map aur Doubly Linked List (DLL) ka combo use hota hai.
 * 2. Map store karega: key -> Node pointer.
 * 3. DLL maintain karega order:
 *    - Naya element hamesha 'Head' (Most Recent) pe aayega.
 *    - Jab koi element access hoga (get), use utha ke wapas 'Head' pe daal denge.
 *    - Jab space khatam hogi, 'Tail' (Least Recent) wala element udayenge.
 */

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        // Dummy Head and Tail to simplify logic
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _addAtHead(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (this.map.has(key)) {
            let node = this.map.get(key);
            this._remove(node);
            this._addAtHead(node);
            return node.value;
        }
        return -1;
    }

    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }

        if (this.map.size === this.capacity) {
            // Remove least recently used (at tail's prev)
            let lastNode = this.tail.prev;
            this.map.delete(lastNode.key);
            this._remove(lastNode);
        }

        let newNode = new Node(key, value);
        this.map.set(key, newNode);
        this._addAtHead(newNode);
    }
}

// Test Case
let cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log("Get 1:", cache.get(1)); // 1
cache.put(3, 3);                   // 2 hat jayega
console.log("Get 2:", cache.get(2)); // -1
