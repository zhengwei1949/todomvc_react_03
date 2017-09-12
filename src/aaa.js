import React, { Component } from 'react';
import '../node_modules/todomvc-app-css/index.css'

class MyHeader extends Component {
  handleSubmit = (e) => {
    this.props.handleSubmit(e)
  }
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={this.handleSubmit}>
          <input className="new-todo" placeholder="What needs to be done?" autoFocus />
        </form>
      </header>
    )
  }
}

class MyFooter extends Component {
  clearCompleted = () => {
    this.props.clearCompleted()
  }
  render() {
    return (
      <footer className="footer">
        {/* <!-- This should be `0 items left` by default --> */}
        <span className="todo-count"><strong>{this.props.length}</strong> item left</span>
        {/* <!-- Remove this if you don't implement routing --> */}
        <ul className="filters">
          <li>
            <a className={this.props.status === '#/' ? 'selected' : ''} href="#/">All</a>
          </li>
          <li>
            <a href="#/active" className={this.props.status === '#/active' ? 'selected' : ''}>Active</a>
          </li>
          <li>
            <a href="#/completed" className={this.props.status === '#/completed' ? 'selected' : ''}>Completed</a>
          </li>
        </ul>
        {/* <!-- Hidden if no completed items are left ↓ --> */}
        <button className="clear-completed" onClick={this.props.clearCompleted}>Clear completed</button>
      </footer>
    )
  }
}

class TodoItem extends Component {
  toggleEdit=(index)=>{
    this.props.toggleEdit(index)
  }
  handleEdit = (e)=>{
    e.preventDefault();
    this.props.handleEdit();
  }
  handleToggleItem = ()=>{
    this.props.handleToggleItem();
  }
  render() {
    return (
      <li className={this.props.item.completed === true ? 'completed' : ''} className={this.props.editId === this.props.index ? 'editing' : ''}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={this.props.item.completed} onChange={this.handleToggleItem.bind(this, this.props.index)} />
          <label onDoubleClick={this.toggleEdit.bind(this, this.props.index)}>{this.props.item.name}</label>
          <button className="destroy" onClick={this.props.handleDeleteItem.bind(this, this.props.index)}></button>
        </div>
        <form onSubmit={this.handleEdit}>
          <input className="edit" type='text' defaultValue={this.props.item.name} />
        </form>
      </li>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { name: '吃饭', completed: true },
        { name: '睡觉', completed: false },
        { name: '打豆豆', completed: true },
      ],
      editId: -1,
      status: window.location.hash
    }
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        status: window.location.hash
      })
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.querySelector('input'));
    let myInput = e.target.querySelector('input');
    let obj = { name: myInput.value, completed: false };
    let myArr = this.state.todos;
    myArr.push(obj);
    this.setState({
      todos: myArr
    }, () => {
      myInput.value = '';
    })
  }
  handleToggleItem = (index) => {
    // console.log(index);
    let myArr = this.state.todos;
    myArr[index].completed = !myArr[index].completed;
    this.setState({
      todos: myArr
    })
  }
  handleToggleAll = () => {
    let myArr = this.state.todos;
    let bool = this.refs.toggleAll.checked;
    myArr = myArr.map((item, index) => {
      item.completed = bool;
      return item;
    })
    this.setState({
      todos: myArr
    })
  }
  handleDeleteItem = (index) => {
    // console.log(index)
    let myArr = this.state.todos;
    myArr.splice(index, 1);
    this.setState({
      todos: myArr
    })
  }
  clearCompleted = () => {
    let myArr = this.state.todos;
    myArr = myArr.filter((item) => item.completed === false);
    this.setState({
      todos: myArr
    })
  }
  toggleEdit = (index) => {
    this.setState({
      editId: index
    }, () => {
      this.refs.myUl.querySelectorAll('input[type=text]')[index].focus()
    })
  }
  handleEdit = () => {
    let myArr = this.state.todos;
    myArr
    this.setState({
      editId: -1
    })
  }
  render() {
    let viewArr = [];
    switch (this.state.status) {
      case '#/completed':
        viewArr = this.state.todos.filter((item) => item.completed === true);
        break;
      case '#/active':
        viewArr = this.state.todos.filter((item) => item.completed === false);
        break;
      default:
        viewArr = this.state.todos;
        break;
    }
    return (
      <section className="todoapp">
        <MyHeader handleSubmit={this.handleSubmit} />
        {/* <!-- This section should be hidden by default and shown when there are todos --> */}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" onChange={this.handleToggleAll} ref="toggleAll" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list" ref='myUl'>
            {/* <!-- These are here just to show the structure of the list items --> */}
            {/* <!-- List items should get the className `editing` when editing and `completed` when marked as completed --> */}
            {
              viewArr.map((item, index) => {
                return (
                  <TodoItem key={index} index={index} editId={this.state.editId} item={item} handleToggleItem={this.handleToggleItem} toggleEdit={this.toggleEdit} handleDeleteItem={this.handleDeleteItem} handleEdit={this.handleEdit} handleToggleItem={this.handleToggleItem} />
                )
              })
            }
          </ul>
        </section>
        {/* <!-- This footer should hidden by default and shown when there are todos --> */}
        <MyFooter length={this.state.todos.filter((item) => item.completed === false).length} clearCompleted={this.clearCompleted} status={this.state.status} toggleEdit={this.toggleEdit} />
      </section>
    );
  }
}

export default App;
