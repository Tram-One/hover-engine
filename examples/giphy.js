const fetch = require('node-fetch')
const HoverEngine = require('../hover-engine')

const GIPHY_API_KEY = 'qcqAg2MoMDFsqD8A62ZvsRz8U06hioZ2'

const gifActions = {
  init: () => ({url: '', status: 'NOT_LOADED'}),
  fetchGIF: (state, searchString, actions) => {
    fetch(`https://api.giphy.com/v1/gifs/search?q=${searchString}&api_key=${GIPHY_API_KEY}`)
      .then(data => data.json())
      .then(({data}) => {
        actions.setURL(data[0].images.original.url)
      })
    return Object.assign({}, state, {status: 'LOADING'})
  },
  setURL: (state, url) => Object.assign({}, state, {url: url, status: 'LOADED'})
}

const engine = new HoverEngine()
engine.addListener((store) => console.log('SUBSCRIPTION:', store))
engine.addActions({giphy: gifActions})

engine.actions.fetchGIF('cat')
