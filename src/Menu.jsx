import React, {Component} from 'react';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }     

  componentDidMount() {
    this.intervalID = setInterval(() => {
      this.updateMenu()
    }, 1000);
  }

  updateMenu() {
    // using props id to allow change in variables
    // using state would make the variable unable to be 
    // updated from parent
    let req = {
      id: this.props.id,
      meal: this.props.cur_meal
    }
    fetch('/items', {
     method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      let new_items = [];
      console.log(data);
      data.forEach((row) => {
        new_items.push(row['food']);
      });
      this.setState({
        items: new_items
      });
    }).catch((e) => {
      console.log(e); 
    });
  }

  render() {
    return (
      <div className='menu'>
      {
        this.state.items.map((item, index) => {
          return (<span className='menu-item' key={index}> {item} </span>) 
        })
      }
      </div>
    );
  }
}

export default Menu;
