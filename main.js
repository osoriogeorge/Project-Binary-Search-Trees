import { Tree } from "./bst.js";

function getRandomArray(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 100));
}

function isBalanced(tree) {
  if (!tree.root) return true;

  const checkBalance = (node) => {
    if (!node) return 0;

    const leftHeight = checkBalance(node.left);
    const rightHeight = checkBalance(node.right);

    if (
      leftHeight === -Infinity ||
      rightHeight === -Infinity ||
      Math.abs(leftHeight - rightHeight) > 1
    ) {
      return -Infinity;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  };

  return checkBalance(tree.root) !== -Infinity;
}

const randomArray = getRandomArray(20);
const tree = new Tree(randomArray);

console.log("Is balanced:", isBalanced(tree));
