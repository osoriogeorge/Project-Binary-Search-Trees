class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    if (!array || array.length === 0) {
      return null;
    }

    const sortedArray = [...new Set(array.sort((a, b) => a - b))];

    const build = (arr, start, end) => {
      if (start > end) {
        return null;
      }

      const mid = Math.floor((start + end) / 2);
      const node = new Node(arr[mid]);

      node.left = build(arr, start, mid - 1);
      node.right = build(arr, mid + 1, end);

      return node;
    };

    return build(sortedArray, 0, sortedArray.length - 1);
  }

  add(data) {
    if (!this.root) {
      this.root = new Node(data);
      return;
    }
    this.addNode(this.root, data);
  }

  addNode(node, data) {
    if (data < node.data) {
      if (node.left === null) {
        node.left = new Node(data);
      } else {
        this.addNode(node.left, data);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(data);
      } else {
        this.addNode(node.right, data);
      }
    }
  }

  getSuccessor(curr) {
    curr = curr.right;
    while (curr !== null && curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }

  delNode(root, data) {
    if (root === null) {
      return root;
    }

    if (root.data > data) {
      root.left = this.delNode(root.left, data);
    } else if (root.data < data) {
      root.right = this.delNode(root.right, data);
    } else {
      if (root.left === null) return root.right;
      if (root.right === null) return root.left;

      let succ = this.getSuccessor(root);
      root.data = succ.data;
      root.right = this.delNode(root.right, succ.data);
    }
    return root;
  }

  delete(data) {
    this.root = this.delNode(this.root, data);
  }

  search(root, key) {
    if (root === null) {
      return null;
    }

    if (root.data === key) {
      return root;
    }

    if (key > root.data) {
      return this.search(root.right, key);
    } else {
      return this.search(root.left, key);
    }
  }

  find(key) {
    return this.search(this.root, key);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback function is required.");
    }

    if (this.root === null) {
      return;
    }

    const queue = [this.root];

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);
      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }
  }

  printInorder(node = this.root) {
    if (node) {
      this.printInorder(node.left);
      console.log(node.data);
      this.printInorder(node.right);
    }
  }

  printPreOrder(node = this.root) {
    if (node == null) return;

    console.log(node.data + " ");

    this.printPreOrder(node.left);
    this.printPreOrder(node.right);
  }

  printPostOrder(node = this.root) {
    if (node === null) return;

    this.printPostOrder(node.left);
    this.printPostOrder(node.right);
    console.log(node.data + " ");
  }

  height(node = this.root) {
    if (node === null) {
      return -1;
    }
    let lHeight = this.height(node.left);
    let rHeight = this.height(node.right);
    return Math.max(lHeight, rHeight) + 1;
  }

  depth(node) {
    if (node === null) {
      return -1;
    }

    let current = node;
    let depthCount = 0;

    while (current !== this.root && current !== null) {
      current = this.findParent(current);
      depthCount++;
    }
    if (current === null) {
      return -1;
    }

    return depthCount;
  }

  findParent(node) {
    if (node === this.root) {
      return null;
    }
    return this.findParentRecursive(this.root, node);
  }

  findParentRecursive(currentNode, targetNode) {
    if (currentNode === null) {
      return null;
    }

    if (currentNode.left === targetNode || currentNode.right === targetNode) {
      return currentNode;
    }

    const leftParent = this.findParentRecursive(currentNode.left, targetNode);
    if (leftParent !== null) {
      return leftParent;
    }

    return this.findParentRecursive(currentNode.right, targetNode);
  }

  isBalanceFactor(node = this.root) {
    if (!node) return 0;

    return this.height(node.left) - this.height(node.right);
  }

  rebalance() {
    const sortedArray = this.inorderArray();
    this.root = this.buildTree(sortedArray);
  }

  inorderArray(node = this.root, array = []) {
    if (node === null) {
      return array;
    }

    this.inorderArray(node.left, array);
    array.push(node.data);
    this.inorderArray(node.right, array);

    return array;
  }
}

const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7];
const tree = new Tree(array);

tree.add(10);
tree.add(2);
tree.add(12);
tree.delete(12);
const foundNode = tree.find(23);

if (foundNode) {
  console.log("Node found:", foundNode.data);
} else {
  console.log("Node not found.");
}

tree.levelOrder((node) => {
  console.log("Node value:", node.data);
});

console.log("Tree height:", tree.height());

const nodeToFindDepth = tree.find(5);

if (nodeToFindDepth) {
  console.log("Node depth:", tree.depth(nodeToFindDepth));
} else {
  console.log("Node not found.");
}

const nodeToCheckBalance = tree.find(5);

if (nodeToCheckBalance) {
  console.log("Node balance factor:", tree.isBalanceFactor(nodeToCheckBalance));
} else {
  console.log("Node not found.");
}

tree.rebalance();

tree.prettyPrint();
