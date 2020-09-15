class TrieNode {
  letter: string = "";
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

function nodeIterator(
  word: string,
  root: TrieNode,
  callback: (letter: string, node: TrieNode, previousNode?: TrieNode) => boolean
) {
  const letters = word.split("");
  let node: TrieNode | undefined = root;
  let previousNode: TrieNode | undefined = undefined;

  for (let index = 0; index < letters.length; ++index) {
    if (!node) {
      break;
    }
    const letter = letters[index];
    if (!node.children.has(letter)) {
      node.children.set(letter, new TrieNode());
    }
    node = node.children.get(letter);
    if (!node) {
      break;
    }
    node.letter = letter;
    if (index === letters.length - 1) {
      return callback(letter, node, previousNode);
    }
    previousNode = node;
  }
  return false;
}

export class Trie<T extends TrieNode> {
  root: T;

  constructor(nodeType: new () => T) {
    this.root = new nodeType();
  }

  insert(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => {
      node.letter = letter;
      node.isEnd = true;
      return true;
    });
  }

  remove(word: string) {
    return nodeIterator(word, this.root, (letter, node, previous) => {
      if (node.isEnd) {
        if (node.children.size === 0 && previous) {
          previous.children.delete(node.letter);
        }
        return true;
      }
      return false;
    });
  }

  has(word: string) {
    return nodeIterator(
      word,
      this.root,
      (letter, node, previous) => node.isEnd
    );
  }
}
