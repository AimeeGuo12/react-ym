// React.Component的实现
// React.Component包含了一些预先定义好的变量和方法啊:
import {renderComponent} from './react-dom';
import {enqueueSetState} from './set_state_queue';
class Component{

    constructor(props = {}) {
        // 通过继承React.Component定义的组件有自己的私有状态state，可以通过this.state获取到。同时也能通过this.props来获取传入的数据。
        // 所以在构造函数中， 我们需要初始化state和props
        this.state = {};
        this.props = props;
    }

    setState(statChange) {
        // Object.assign(this.state, statChange);
        // // 每次更新state后,我们需要调用renderComponent方法来重新渲染组件
        // renderComponent(this);
        enqueueSetState(stateChange,this);
    }
}

export default Component;