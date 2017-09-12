import React, { Component } from 'react';
import '../node_modules/todomvc-app-css/index.css'
import {createStore} from 'redux'
let initState = {
      todos: [
        { name: '吃饭', completed: true },
        { name: '睡觉', completed: false },
        { name: '打豆豆', completed: true },
      ],
      editId: -1,
      status: window.location.hash
}

let reducer = (state = initState,action)=>{
  switch(action.type){
    case 'ADD_TODO':
      // console.log(action.payload);
      let newState = {todos:[...state.todos,{name:action.payload.text,completed:false}],editId:state.editId,status:state.status}
      return newState;
    case 'CLEAR_COMPLETED':
      return {todos:[...state.todos.filter((item)=>item.completed===false)],editId:state.editId,status:state.status}
    case 'HASH_CHANGE':
      return {todos:[...state.todos],editId:state.editId,status:action.payload.status}
    case 'TOGGLE_EDIT':
      return {todos:[...state.todos],editId:action.editId,status:store.status}
    case 'HANDLE_EDIT':
      let myArr = state.todos;
      myArr[action.index].name = action.val;
      return {todos:[...myArr],editId:action.editId,status:state.status}
    case 'HANDLE_TOGGLE_ITEM':
      let myArr1 = state.todos;
      myArr1[action.index].completed = !myArr1[action.index].completed;
      return {todos:[...myArr1],editId:state.editId,status:state.status}
    case 'HANDLE_DELETE':
      let myArr2 = state.todos;
      myArr2.splice(action.index,1);
      return {todos:[...myArr2],editId:state.editId,status:state.status}
    case 'HANDLE_TOGGLE_ALL':
      let myArr3 = state.todos;
      myArr3 = myArr3.map((item,index)=>{
        item.completed = action.bool;
        return item;
      })
      return {todos:[...myArr3],editId:state.editId,status:state.status}
    default:
      return state;
  }
}

let store = createStore(reducer);

class MyHeader extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    let myInput = e.target.querySelector('input');
    store.dispatch({
      type:'ADD_TODO',
      payload:{
        text:myInput.value
      }
    })
    myInput.value = '';
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
    store.dispatch({
      type:'CLEAR_COMPLETED'
    })
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
        <button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button>
      </footer>
    )
  }
}

class TodoItem extends Component {
  toggleEdit=(index)=>{
    store.dispatch({
      type:'TOGGLE_EDIT',
      editId:index
    })
    setTimeout(()=>{
      this.refs.myVal.focus()
    })
  }
  handleEdit = (index,e)=>{
    e.preventDefault();
    store.dispatch({
      type:'HANDLE_EDIT',
      index:index,
      val:this.refs.myVal.value
    })
  }
  handleToggleItem = (index)=>{
    store.dispatch({
      type:'HANDLE_TOGGLE_ITEM',
      index:index
    })
  }
  handleDeleteItem = (index)=>{
    store.dispatch({
      type:'HANDLE_DELETE',
      index:index
    })
  }
  render() {
    return (
      <li className={(this.props.item.completed === true ? 'completed' : '') + ' ' + (this.props.editId === this.props.index ? 'editing' : '')}>
        <div className="view">
          <input  className="toggle" type="checkbox" checked={this.props.item.completed} onChange={this.handleToggleItem.bind(this, this.props.index)} />
          <label onDoubleClick={this.toggleEdit.bind(this, this.props.index)}>{this.props.item.name}</label>
          <button className="destroy" onClick={this.handleDeleteItem.bind(this, this.props.index)}></button>
        </div>
        <form onSubmit={this.handleEdit.bind(this,this.props.index)}>
          <input className="edit" type='text' defaultValue={this.props.item.name} ref='myVal' />
        </form>
      </li>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
  }
  componentDidMount() {
    store.subscribe(()=>{
      this.setState({
        todos:store.getState().todos,
        editId:store.getState().editId,
        status:store.getState().status,
      });
    })
    window.addEventListener('hashchange', () => {
      store.dispatch({
        type:'HASH_CHANGE',
        payload:{
          status:window.location.hash
        }
      })
    })
  }
  handleToggleAll = () => {
    let bool = this.refs.toggleAll.checked;
    store.dispatch({
      type:'HANDLE_TOGGLE_ALL',
      bool:bool
    })
  }
  render(){
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
        <MyHeader />
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
                  <TodoItem key={index} index={index} editId={this.state.editId} item={item}  />
                )
              })
            }
          </ul>
        </section>
        {/* <!-- This footer should hidden by default and shown when there are todos --> */}
        <MyFooter length={this.state.todos.filter((item) => item.completed === false).length}  status={this.state.status}  />
      </section>
    );
  }
}

export default App;