class Highlighter {
  constructor(root) {
    this._root = root;
  }

  _initializeOverlay() {
    if (!this._overlay) {
      this._overlay = this._root.ownerDocument.createElement('div');
      const style = this._overlay.style;
      style.position = 'absolute';
      style.top = 0;
      style.bottom = 0;
      style.left = 0;
      style.right = 0;
      style.pointerEvents = 'none';
      style.userSelect = 'none';
      this._root.appendChild(this._overlay);
    }
  }

  _createInsNode() {
    const node = this._root.ownerDocument.createElement('ins');
    const style = node.style;
    style.textDecoration = 'none';
    style.color = 'var(--lumin-color, currentColor)';
    style.background = 'var(--lumin-background-color, yellow)';
    return node;
  }

  _createBufferNode() {
    const node = this._root.ownerDocument.createElement('ins');
    const style = node.style;
    style.textDecoration = 'none';
    style.color = 'transparent';
    style.opacity = 0;
    return node;
  }

  _reset() {
    this._initializeOverlay();
    this.stop();
    this._map = [];
    this._charCount = 0;
    const children = this._root.childNodes;
    for (let i = 0; i < children.length; i++) {
      if (children[i] != this._overlay) {
        this._process(this._overlay, children[i]);
      }
    }
  }

  _process(parent, node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const newNode = node.cloneNode(false);
      newNode.textContent = '';
      const text = node.textContent;
      const ins = this._createInsNode();
      const buffer = this._createBufferNode();
      ins.appendChild(newNode);
      buffer.textContent = text;
      parent.appendChild(ins);
      parent.appendChild(buffer);
      const length = text.length ? Math.max(text.trim().length, 1) : 0;
      this._map.push({
        node: newNode,
        buffer,
        text,
        length,
        current: ''
      });
      this._charCount += length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const newNode = node.cloneNode(false);
      parent.appendChild(newNode);
      const children = node.childNodes;
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          this._process(newNode, children[i]);
        }
      }
    }
  }

  stop() {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }

  clear() {
    if (this._overlay) {
      this._root.removeChild(this._overlay);
      this._overlay = null;
    }
  }

  start(duration) {
    delete this._prevValue;
    if (!this._overlay) {
      this._reset();
    }
    if (!this._charCount) {
      this._charCount = 1;
    }
    this._interval = duration / this._charCount;
    this._cursor = 0;
    this._nextTick();
  }

  _nextTick() {
    this._timer = setTimeout(() => this._tick(), this._interval);
  }

  _tick() {
    if (this._cursor >= this._map.length) {
      return;
    }
    let d = this._map[this._cursor];
    const diff = d.text.length - d.current.length;
    if (diff <= 0) {
      this._cursor++;
      this._tick();
    } else {
      if (!d.length) {
        d.current = d.text
      } else {
        d.current = d.text.substring(0, d.current.length + 1);
      }
      d.node.textContent = d.current;
      d.buffer.textContent = d.text.substring(d.current.length);
      this._nextTick();
    }
  }

  set progress(value) {
    value = Math.min(100, Math.max(0, value));
    const progressCharCount = Math.round(this._charCount * value / 100);
    const reset = (!this._prevValue) || (this._prevValue > progressCharCount);
    if (reset) {
      this.clear();
    }
    if (!this._overlay) {
      this._reset();
    }
    let count = 0;
    for (const d of this._map) {
      let diff = progressCharCount - count;
      if (diff <= 0) {
        break;
      }
      if (d.length < diff) {
        d.current = d.text;
        d.node.textContent = d.current;
        d.buffer.textContent = '';
        count += d.length;
      } else {
        d.current = d.text.substring(0, diff);
        d.node.textContent = d.current;
        d.buffer.textContent = d.text.substring(d.current.length);
        count += diff;
      }
    }
  }
}

export default function lumin(node) {
  return new Highlighter(node);
}