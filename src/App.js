import { render } from '@testing-library/react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Component } from 'react';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'fad4061631cc4bc9b1e9ef2be0b6cde7';

const app = new Clarifai.App({
  apiKey: 'f57961bb95d0414588fc02665809c524'
});
 
console.log(Clarifai);

const particlesInit = async (main) => {
  console.log(main);

  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(main);
};

const particlesLoaded = (container) => {
  console.log(container);
};

const initialState = {
    input: '', //what the user will input
    imageUrl:  '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
  } 
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    }
  

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {
    // const clarifaiFace = data;
    // let obj1 = [];
    // for (let key in data.outputs[0].data.regions) {
    //   console.log(key.region_info.bounding_box);
    // }
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // let clarifaiFaceObj = data.outputs[0].data.regions;
    // for (let i = 0; i < clarifaiFaceObj.length; i++) {
    //   obj1.push(clarifaiFaceObj[i].region_info.bounding_box);
    // }
    // console.log(obj1);
    const image = document.getElementById('inputimage');
    const width = (image.width);
    const height = (image.height);
    console.log(clarifaiFace);
    console.log(data);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": "fnym8cac78jg",
          "app_id": "b361a39df1404941af9b5d95dce0df05"
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": this.state.input
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id

  fetch("https://api.clarifai.com/v2/models/a403429f2ddf4b49b307e318f00e528b/outputs", requestOptions)
      .then(response => response.json())          //response.text())
      .then((response) => {
        if (response) {
          fetch('https://damp-forest-29967.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          });
        }
      this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log('error', error));
    }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
          <Particles
                  className='particles'
                  id="tsparticles"
                  init={particlesInit}
                  loaded={particlesLoaded}
                  options={{
                    background: {
                      color: {
                        opacity: 1
                      },
                    },
                    fpsLimit: 120,
                    interactivity: {
                      events: {
                        onClick: {
                          enable: true,
                          mode: "push",
                        },
                        onHover: {
                          enable: true,
                          mode: "repulse",
                        },
                        resize: true,
                      },
                      modes: {
                        push: {
                          quantity: 4,
                        },
                        repulse: {
                          distance: 200,
                          duration: 1,
                        },
                      },
                    },
                    particles: {
                      color: {
                        value: "#ffffff",
                      },
                      links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                      },
                      collisions: {
                        enable: true,
                      },
                      move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                          default: "bounce",
                        },
                        random: false,
                        speed: 3,
                        straight: false,
                      },
                      number: {
                        density: {
                          enable: true,
                          area: 800,
                        },
                        value: 10,
                      },
                      opacity: {
                        value: 0.1,
                      },
                      shape: {
                        type: "circle",
                      },
                      size: {
                        value: { min: 1, max: 5 },
                      },
                    },
                    detectRetina: true,
                  }}
                  />

      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home' 
      ? <div>
          <Logo />
          <Rank 
          name={this.state.user.name} 
          entries={this.state.user.entries}
          />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition 
          box={box} 
          imageUrl={imageUrl}
          />
        </div>
      :  (
        route == 'signin' ? 
        <Signin 
        loadUser={this.loadUser} 
        onRouteChange={this.onRouteChange}
        />
        : <Register 
        onRouteChange={this.onRouteChange} 
        loadUser={this.loadUser}/>
      )
    }
    </div>
  );
}
}

export default App;
