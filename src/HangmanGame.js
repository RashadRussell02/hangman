import './App.css';
import React from 'react';
import LetterBox from './LetterBox';
import SingleLetterSearchbar from './SingleLetterSearchBar';

const pics = ['noose.png', 'upperBody.png', 'upperandlower.png', '1arm.png', 'botharms.png'];
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];
class HangmanGame extends React.Component {
  state = {
    wordList: [],
    curWord:  0,
    lifeLeft: 0,
    usedLetters: []
  }
  componentDidMount() {
    
    console.log(words);
    this.setState({
      wordList: words
    });
  }
  getPlayerName = (name) => {
    this.setState({
      playerName: name
    });
  }
  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * this.state.wordList.length)
    });
  }

  render(){
    const word = this.state.wordList[this.state.curWord];
    return(
      <div>
        <img src={pics[this.state.lifeLeft]}/>
        <button onClick={this.startNewGame}>New Game</button>
        <p>{word}</p>
        <SingleLetterSearchbar></SingleLetterSearchbar>

        <LetterBox 
          letter="a"
          isVisible={true}
          boxStyle={{ backgroundColor: 'lightblue' }}
          letterStyle={{ color: 'white', fontSize: '30px' }}
        ></LetterBox>
      </div>
    )
  }

}



export default HangmanGame;
