const React = {
    createElement
}
//createElement方法返回的对象记录了这个DOM节点所有的信息,换句话说,通过它我们可以生成真正的DOM,这个记录信息的对象的我们称之为虚拟DOM
function createElement(tag, attrs, ...childrens) {
    return {
        tag, attrs, childrens
    }
}

const element = (
    <div className='title'>
        hello <span className='react'>react</span>
        <span>无</span>
    </div>
)

console.log(element)
// 使用
// React.createElement('div', {className: "title"}, 'hello, react')

export default React;