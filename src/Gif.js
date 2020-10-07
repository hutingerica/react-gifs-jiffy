import React, {Component} from 'react';

class Gif extends Component {
    //when our video has loaded we add a loaded className
    //otherwise the video stays hidden
    constructor(props){
        super(props)
        this.state = {
            loaded: false
        }
    }
    render(){
        const {loaded} = this.state
        const {images,id} = this.props
        return(
        <video
            //when we have the loaded state as true, we add a loaded class
            className= {`grid-item video ${loaded && 'loaded'}`}
            autoPlay
            loop
            playsinline
            muted
            key={id}
            src={images.original.mp4}
            //when the video loads we set the loaded state to be ture
            onLoadedData={() => this.setState({loaded:true})}
          />
        )}
}
export default Gif