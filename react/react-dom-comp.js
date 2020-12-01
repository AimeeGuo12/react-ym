const ReactDOM = {
    render
}

function render(vnode,container) {

    return container.appendChild(_render(vnode));
}

// createComponent方法用来创建组件实例,并且我想将函数定义组件扩展成为类定义的组件,为了后面方便处理
