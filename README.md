# LuminJS
A JavaScript library to progressively highlight any text on a page.

Great for when you want users to pay attention to some important text.<br> It can also be used to show progress of a task − Read something while tasks are being completed.

Related buzz words: _Tiny (~1kB gzipped)_, _No-dependency_

Visit [lumin.rocks](https://lumin.rocks/) to see it in action.

![Demo gif](https://lumin.rocks/images/highlight.gif)

## Install

Download the latest from [dist folder](https://github.com/pshihn/lumin/tree/master/dist)

or from npm:
```
npm install --save lumin
```

## Usage

Instantiate **lumin** with a node. All text under that node, including child nodes, will be highlighted. Then call *start* to start highlighting.

```javascript
const luminator = lumin(domNode);
luminator.start(5000); // 5000ms to highlight
```

Or you can manually control the progress
```javascript
// Set progress to 50%
luminator.progress = 50;
```

**Note**: _The node being instantiated with has to be a positioned node. i.e. position is not static for this to work. In most cases, **position:relative** will do the trick._

## Full API

### progress

Numeric property one can set to indicate the progress of the highlight. The value is in percentage (0 to 100). This is useful when showing a progress of a task, e.g., a file upload. 

### start(duration)

Start the highlight.

_duration_ is the approximate time in milliseconds the highlighting should take.

**returns** a promise which is resolved when the highlight ends. The resolved value is __true__ if the animation ends without interruption; __false__ if _stop_ was called.

### stop()

Stops highlighting if it's in progress. 

### clear()

Clears the highlighting.

## Examples

See it live in action on [lumin.rocks](https://lumin.rocks/) or some code in the [Examples folder](https://github.com/pshihn/lumin/tree/master/examples).


## License
[MIT License](https://github.com/pshihn/lumin/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
