import Component from './component.js';
import React from './react.js';
// render的实现
// 所以render的第一个参数实际上接受的是createElement返回的对象，也就是虚拟DOM .而第二个参数则是挂载的目标DOM
// 总而言之，render方法的作用就是将虚拟DOM渲染成真实的DOM

export const ReactDOM = {
    render: (vnode, container) => {
        container.innerHTML = ''; // 多次调用render时，先清除一下挂载目标DOM的内容
        return render(vnode, container)
    }
}

function render(vnode, container) {
    if (vnode === undefined) return;
    // 如果是函数，则渲染组件
    if (typeof vnode.tag === 'function') {
        // 1. 创建组件
        const comp = createComponent(vnode.tag, vnode.attrs);
        // 2. 设置组件的属性
        setComponentProp(comp, vnode.attrs);
        // 3. 返回当前组件的jsx对象
        return comp.base;
    }
     // 如果vnode是字符串是,渲染结果是一段文本
    if (typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
    }
    // 否则是一个虚拟DOM对象
    const {tag} = vnode;
    // 创建节点对象
    const dom = document.createElement(tag);
    console.log(dom);

    if (vnode.attrs) {
        // 如果有属性
        Object.keys(vnode.attrs).forEach(key => {
            const val = vnode.attrs[key];
            // 为上面的节点对象设置属性
            setAttribute(dom, key, val);
        })
    }
    // 递归渲染子节点
    vnode.childrens && vnode.childrens.forEach(child => render(child, dom))
    // 将渲染结果挂载到真正的DOM上
    return container.appendChild(dom);
}

// 设置属性需要考虑一些特殊情况(className,onClick,其它属性等),我们单独将其封装一个方法setAttribute

function setAttribute(dom, key, value) {
    // 如果属性名是className,则改为class
    if (key === 'className') {
        key = 'class';
        // return key
    }

     // 如果属性名是onClick onBlur onChange.... 则是事件监听的方法
     if (/on\w+/.test(key)) {
        // 转小写
        key = key.toLowerCase();
        dom[key] = value || ''; // ?
     } else if (key === 'style') {  //如果属性名是style,则更新style对象
         if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
         } else if (value && typeof value === 'object') {
            // 更新style对象
            for (let k in value) {
                // 可以通过style={width:20}这种形式来设置样式,可以省略掉单位px
                if (typeof value[k] === 'number') {
                   dom.style[k] = value[k] + 'px';
                    
                } else {
                    dom.style[k] = value[k]
                }
                //  dom.style[ k ] = typeof value[ k ] === 'number' ? value[ k ] + 'px' : value[ k ];
            }
         }
     } else {  //普通属性则直接更新属性
        if (key in dom) {
            dom[key] = value || '';
        }
        if (value) { // 有值则更新
            dom.setAttribute(key, value);
        } else { // 没有值 移除此属性
            dom.removeAttribute(key);
        }
     }
}

export function renderComponent(comp) {
    // 声明一个初始化变量,用来保存当前js节点对象
    let base;
    const renderer = comp.render(); ////调用render方法之后,返回的是jsx对象
    // 实现componentWillUpdate componentDidUpdate componentDidMount生命周期方法
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }
    
    // // 返回js节点对象
    // base = _render(renderer);
    // 修改
    base = diffNode(comp.base, renderer);
    comp.base = base;

    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate();
    } else if (comp.componentDidMount) {
        comp.componentDidMount();
    }

    // 删除这部分
    // // 如果调用了setState,节点替换
    // if (comp.base && comp.base.parentNode) {
    //     comp.base.parentNode.replaceChild(base, comp.base);
    // }
    //  // 为组件挂载js节点对象
    //  comp.base = base;
    //  base._component = comp;
}

// const ReactDOM = {
//     render
// }

// function render(vnode,container) {

//     return container.appendChild(_render(vnode));
// }

// createComponent方法用来创建组件实例,并且我想将函数定义组件扩展成为类定义的组件,为了后面方便处理


/* 
    @comp: 为当前函数组件还是类定义的组件  (都是函数)
    @props: 组件属性
    @return: 返回当前组件
*/
function createComponent(comp, props) {
    let inst;
    // 如果是类定义的组件， 则直接返回实例
    if (comp.prototype && comp.prototype.render) { //有原型,原型上有render函数,则是类
        inst = new comp(props)
    } else {
         /* 
            function Home(){
                return <div>hello</div>
            }
        */
        // 是函数组件,则将函数组件扩展成类定义的组件 方便后面的统一处理
        inst = new Component(props);
        // 改变构造函数指向
        inst.constructor = comp;
        // 定义render函数
        inst.render = function() {
            return this.constructor(props);
        }
    }
    return inst;
}

// 更新props 在setComponentProps方法中可以实现componentWillMount和componentWillReceiveProps两个生命周期方法
function setComponentProp(comp, props) {
    // 实现生命周期方法
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount();
    } else if (comp.componentWillReceiveProps) {
        comp.componentWillReceiveProps(props);
    }
    // 更新props
    comp.props = props;
    // 重新渲染组件
    renderComponent(comp);
}

export {
    setAttribute
}