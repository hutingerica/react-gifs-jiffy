import React, {Component} from 'react';
//here we input in our loader spinner as an image 
import loader from "./images/loader.svg"
import clearButton from "./images/close-icon.svg"
import Gif from "./Gif"

//we pick out our props inside the header component
//we can pass down function as props as well as things like number,
//strings, arrays, objects
const Header = ({closingClick, hasGifs}) => (
  <div className="header grid">
    {hasGifs ?
      (<button onClick={closingClick}>
        <img src={clearButton} alt=""/>
      </button>)
    :
      (<h1 className="title">Jiffy</h1>)
    }
  </div>
)

const UserHint = ({loading, hintText}) => (
<div className="user-hint">
  {/* here we check whether we have a loading state and render out
  either our spinner or hintText based on that, using a ternary operator (if/else)*/}
  {loading? <img className="block mx-auto" src={loader} alt=""/> : hintText}
</div>
)

const randomChoice = arr => {
const randomIndex = Math.floor(Math.random()*arr.length);
return arr[randomIndex]
};

class App extends Component {
constructor(props){
  super(props);
  this.textInput = React.createRef();
  this.state = {
    loading:false,
    searchTerm:'',
    hintText:'',
    gifs:[]
  }
}

//we want a function that searches the giphy api using fetch
//and put the seatch term into the query url and then we can
//do something with the results

//we can also write async methods into our components
//that let us use the async/await style of function
searchGiphy = async (searchTerm) => {

  this.setState({
    //here we set our loading state to be true
    //this will show the spinner at the bottom
    loading: true
  })
  //first we try our fetch
  try{
    //here we use the await keyword to wait for response to come back
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=pnVDZ0W77ZeywTeBf31MWVexy2v2oWDx&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en`);
    //here we convert our raw response into json data
    //const {data} gets the .data part of our response
    const {data} = await response.json();
    //console.log(data.data[0])

    //here we check if the array of results is empty
    //if it is, we throw an error which will stop the code here
    //and handle it in the catch area
    if(!data.length){
      throw `Nothing found for ${searchTerm}`
    }

    //here we grab a random result from our images
    const randomGif = randomChoice(data)
    this.setState((prevState, props) => ({
      ...prevState,
      //here we use our spread to take the previous gifs and 
      //spread them out, and add our new gif onto the end
      gifs:[...prevState.gifs, randomGif],
      loading:false,
      hintText:`Hit enter to see more ${searchTerm}`,
    }))

  //if our fetch fails, we catch it down here
  }catch(error){
    this.setState((prevState, props) =>({
      ...prevState,
      hintText: error,
      loading:false
    }
    ))
    console.log(error)
  }
};

//with create react App we can write out methods as arrow function,
//meaning we dont need the constructor and bind
handleChange = event => {
  //console.log(event.target.value)
  //const value = event.target.value
  const {value} = event.target
  //by setting the searchTerm in our state and also using that
  //on the input as the value, we have created what is called
  //a controlled input
  this.setState((prevState, props) => ({
    //we take out old props and spread them here
    ...prevState,
    //and then we overwrite the ones we want after
    searchTerm: value,
    //we set the hint text when we have more than 2 characters in our input searchTerm
    //otherwise we make it a blank string
    hintText: value.length >2 ? `Hit enter to search ${value}` : ''
  }));
};

handleKeyPress = event => {
  const {value} = event.target
  if(value.length > 2 && event.key === "Enter"){
    //her we call out our searchGiphy function using the search Term
    this.searchGiphy(value)
  }
  // this.setState(()=>({
  //   hintText:`Hit enter to see more ${value}`,
  //   closing:true
  // }))
};
  //we reset our state by cleaning everything to the original state
  //make it default again
clearSearch = () => {
  this.setState((prevState, props) => ({
    ...prevState,
    searchTerm:'',
    hintText:'',
    gifs:[]
  }))
  //here we grab the input and then focus the cursor back into it
  this.textInput.current.focus()
  //console.log(this.textInput)
}

render(){
  //const searchTerm = this.state.searchTerm
  const {searchTerm, gifs} = this.state;
  //here we set a variable to see if we have any gifs
  const hasGifs = gifs.length;
  console.log(searchTerm)
  return (
    <div className="page">
      <Header closingClick={this.clearSearch} hasGifs={hasGifs}/>
      <div className="search grid">
        {/* our stake of gif images*/}
        {/* it's only going to render video when we have a gif
        in the state, we can test for it using &&*/}
        {/* {gif && <video
          className= "grid-item video"
          autoPlay
          loop
          src={gif.images.original.mp4}
        />} */}
        {gifs.map(gif =>(
        //   <video
        //   className= "grid-item video"
        //   autoPlay
        //   loop
        //   key={gif.id}
        //   src={gif.images.original.mp4}
        // />
            <Gif {...gif}/>
        ))}

        <input
          className="input grid-item"
          placeholder="Type something"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          value={searchTerm}
          ref={this.textInput}
        />
      </div>
      {/*here we pass out userHint all of our state using a spread*/}
      <UserHint {...this.state}/>
    </div>
  )};
}

export default App;
