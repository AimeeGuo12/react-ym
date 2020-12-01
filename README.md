###
安装parcel-bundler

npm i parcel-bundler --save-dev 
###
安装 babel 插件 将jsx的语法转化成js对象(这个js对象即所谓的虚拟DOM)
npm i babel-core babel-preset-env babel-plugin-transform-react-jsx --save-dev

JSX 语法糖经过 Babel 编译后转换成一种对象，该对象即所谓的虚拟 DOM，使用虚拟 DOM 能让页面进行更为高效的渲染。

简单的react例子
```javaScript
import React from 'react';
import ReactDOM from 'react-dom';

// 这并不是合法的js代码,它是一种被称为jsx的语法扩展,通过它我们可以很方便的在js代码中书写html片段
// 本质上,jsx是语法糖
const title = <h2 className = 'title'> <span> hello React </span></h2> ;

// 上面代码会被babel转义成下面对象 而这个对象就是所谓的虚拟DOM
/* 
var title = React.createElement("h2", {
    className: "title"
}, " hello React ");
*/
ReactDOM.render(title,document.querySelector('#root'))

/* 
第一个参数是DOM节点的标签名，它的值可能是div，h1，span等等
第二个参数是一个对象，里面包含了所有的属性，可能包含了className，id等等
从第三个参数开始，就是它的子节点
*/
// 从jsx转译结果来看 createElement(tag,attrs,child1,child2,child3,child4...)
```

## 知识点
### 虚拟DOM
createElement方法返回的对象记录了这个DOM节点所有的信息,换句话说,通过它我们可以生成真正的DOM,这个记录信息的对象的我们称之为虚拟DOM
### render的实现
所以render的第一个参数实际上接受的是createElement返回的对象，也就是虚拟DOM .而第二个参数则是挂载的目标DOM
总而言之，render方法的作用就是将虚拟DOM渲染成真实的DOM

### 问题：  在定义React组件或者书写React相关代码，不管代码中有没有用到React这个对象，我们都必须将其import进来，这是为什么？

因为将JSX片段编译并返回JS对象也就是虚拟Dom，需要用到React.createElement()方法，需要导入React

### 
如果JSX片段中的每个元素是组件,那么createElement的第一个参数tag将会是一个方法,而不是字符串
区分组件和原生DOM的工作,是babel-plugin-transform-react-jsx帮我们实现的
```javaScript
function Home(props){
    return <h1>hello,{props.name}</h1>
}
```
我们不需要对createElement做修改，只需要知道如果渲染的是组件，tag的值将是一个函数

### 虚拟DOM的结构可以分为三种,分别表示文本,原生DOM节点以及组件
```javaScript
// 原生DOM节点的vnode
{
    tag: 'div',
    attrs: {
        className: 'container'
    },
    children: []
}

// 文本节点的vnode
"hello,world"

// 组件的vnode
{
    tag: ComponentConstrucotr,
    attrs: {
        className: 'container'
    },
    children: []
}
```

### 子节点diff时的问题：子节点childrens是一个数组,他们可能改变顺序,或者数量有所变化,我们很难确定是和虚拟DOM对比的是哪一个
思路:给节点设置一个key值,重新渲染时对比key值相同的节点,这样我们就能找到真实DOM和哪个虚拟DOM进行对比了
```javaScript
function diffNode(dom,vnode){
     if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
        diffChildren(out, vnode.childrens);
    }
}

```

### setState
1. 异步更新state,将短时间内的多个setState合并成一个
2. 为了解决异步更新导致的问题,增加另一种形式的setState:接受一个函数作为参数,在函数中可以得到前一个状态并返回下一个状态

为了合并setState,我们需要一个队列来保存每次setState的数据,然后在一段时间后,清空这个队列来渲染组件

队列是一种数据结构,它的特点是先进先出,可以通过js数组的push和shift方法模拟,然后需要定义一个"入队"的方法,用来将更新添加进队列

### 异步执行
我们需要合并一段时间内所有的setState,也就是在一段时间后才执行flush方法来清空队列,关键是这一段时间怎么决定

答案毫无疑问就是利用js的事件队列机制

我们可以利用事件队列,让flush的所有同步任务后执行

```javaScript
setTimeout( () => {
    console.log( 2 );
}, 0 );
Promise.resolve().then( () => console.log( 1 ) );
console.log( 3 );
// 3 1 2
```
