// 为了合并setState,我们需要一个队列来保存每次setState的数据,
//然后在一段时间后,清空这个队列来渲染组件
const setStateQueue = [];
// 创建队列  先进先出
// 渲染
const renderQueue = [];

function defer( fn ) {
    return Promise.resolve().then( fn );
}
export function enqueueSetState(stateChange, component) {
    // 如果setStateQueue的长度是0,也就是在上次flush执行之后第一次往队列里添加
    if (setStateQueue.length === 0) {
        defer(flush);
    }

    // 入队 让所有设置的状态 都放入到队列中
    setStateQueue.push({
        stateChange,
        component
    })

    // 如果renderQueue里没有当前组件,则添加到队列中
    let r = renderQueue.some(item => {
        return item === component;
    })
    if (!r) {
        renderQueue.push(component);
    } 
}

// 清空队列

function flush() {
    let item;
    // 遍历state
    while(item = setStateQueue.shift()) {
        const {stateChange, component} = item;
        // 如果没有prevState,则将当前的state作为初始的prevState
        if(!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        } 
         // 如果stateChange是一个方法,也就是setState的第一种形式
        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.prevState, component.props))
        }
        else {
             // 如果stateChange是一个对象,则直接合并到setState中
             Object.assign(component.state, stateChange);
        }
        component.prevState = component.state;
    }
    // 遍历组件
    while (component = renderQueue.shift()) {
        renderComponent(component);
    }
}
