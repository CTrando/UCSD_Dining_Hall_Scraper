import React, {Component} from 'react';

class Menu extends Component {
  constructor(props) {
    super(props);
    // doing this because not allowed to do it during dictionary 
    // construction
    let meals = {};
    meals[props.cur_meal] = [];
    this.state = {
      items: meals
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
      let new_items = {};
      data.forEach((row) => {
        // gotta have that lower casing eh
        let meal = row['type'].toLowerCase();
        if(new_items[meal] === undefined) {
          new_items[meal] = [];
        }
        new_items[meal].push(row['food']);
      });
      console.log(data);
      console.log(new_items);
      this.setState({
        items: new_items
      });
    }).catch((e) => {
      console.log(e); 
    });
  }

  render() {
    if(this.state.items[this.props.cur_meal] === undefined 
      || this.state.items[this.props.cur_meal].length  === 0) {
      return (
        <div className='menu'>
          <span className='menu-item'>
            Sorry, nothing on the menu today!
          </span>
        </div>
      );
    }

    return (
      <div className='menu'>
      {
        this.state.items[this.props.cur_meal].map((item, index) => {
          return (<span className='menu-item' key={index}> {item} </span>) 
        })
      }
      </div>
    );
  }
}

export default Menu;
