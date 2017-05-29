import main, { add, subtract } from './math'

// main is default
// in curly brackets are non default

console.log(add(1,23222))
console.log(subtract(1,2))
main()



//=======
import {delegate, siblings,closest} from './utils'
//main()

//=======
//console.log('hi there hello')

const app = document.querySelector('#app')


// //=====
// Mashable: http://mashable.com/stories.json
// Reddit: https://www.reddit.com/top.json
// Digg: http://digg.com/api/news/popular.json

//=====



delegate('body', 'click', 'li', event =>{
  const target = event.target || event.srcElement
  if(!target || target.nodeName !='A' ) return
  const selectedElem = document.getElementsByClassName('sourceClass')

  state.source = selectedElem.innerText
  render(app, state)
})

document.addEventListener('click',selectFeeder,false)

function selectFeeder(event){
  const target = event.target || event.srcElement
  if(!target || target.nodeName !='LI' ) return
  const selectedElem = document.getElementsByClassName('sourceClass')

  state.source = selectedElem.innerText
  render(app, state)
}




const state = {
  source: 'Digg',
  articles: [
    {
      image: '',
      title: '',
      theme: '',
      impressions: '',
      summary: '',
      link: '',
    }
  ]
}






function fetchUrl(url) {

  return fetch(`https://accesscontrolalloworiginall.herokuapp.com/${url}`)
}

function fetchMashableArticles() {
  return fetchUrl('http://migbylab.com/feed.json')
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return data.new.map(article => {
      return {
        image: article.feature_image,
        title: article.display_title,
        theme: article.channel,
        impressions: article.formatted_shares,
        summary: article.excerpt,
        link: article.short_url
      }
    })
  })
}

//====
function fetchDiggArticles() {
  return fetchUrl('http://digg.com/api/news/popular.json')
  .then(res => res.json())
  .then(info => {
    console.log(info)
    return info.data.feed.map(article => {
      return {
        image: article.content.media.images[0].original_url,
        title: article.content.title,
        theme: article.content.body,
        impressions: article.fb_shares.count,
        summary: article.content.description,
        link: article.content.original_url
      }
    })
  })
}

//====
//====
function fetchRedditArticles() {
  return fetchUrl('https://www.reddit.com/top.json')
  .then(res => res.json())
  .then(info => {
    console.log(info)
    return info .data.children.map(article => {
      return {
        image: article.data.thumbnail,
        title: article.data.title,
        theme: article.data.subreddit_type,
        impressions: article.data.num_comments,
        summary: article.data.title,
        link: article.data.permalink
      }
    })
  })
}
//====


function fetchArticles(source) {
  if (source === 'Mashable') {
    //fetchDiggArticles()
    return fetchMashableArticles()
  }
  if (source === 'Digg') {
    //fetchRedditArticles()
    return fetchDiggArticles()
  }
  if (source === 'Reddit') {

    return fetchRedditArticles()
  }

}

fetchArticles(state.source)
.then(articles => state.articles = articles)
.then(() => render(app, state))

function renderArticles(articles) {
  return articles.map(article => `
    <article class="article">
      <section class="featuredImage">
        <img src="${article.image}" alt="" />
      </section>
      <section class="articleContent">
          <a href="${article.link}"><h3>${article.title}</h3></a>
          <h6>${article.theme}</h6>
      </section>
      <section class="impressions">
        ${article.impressions}
      </section>
      <div class="clearfix"></div>
    </article>
  `).join('\n')
}


function render(container, data) {
  container.innerHTML = `
  <header>
    <section class="container">
      <a href="#"><h1>Feedr</h1></a>
      <nav>
        <ul>
          <li><a href="#">News Source: <span>${data.source}</span></a>
            <ul>
                <li><a href="#" class="sourceClass" data-sourceid="1">Mashable</a></li>
                <li><a href="#" class="sourceClass" data-sourceid="2">Digg</a></li>
                <li><a href="#" class="sourceClass" data-sourceid="3">Reddit</a></li>
            </ul>
          </li>
        </ul>
        <section id="search">
          <input type="text" name="name" value="">
          <a href="#"><img src="images/search.png" alt="" /></a>
        </section>
      </nav>
      <div class="clearfix"></div>
    </section>
  </header>
  <div id="popUp" class="loader hidden">
    <a href="#" class="closePopUp">X</a>
    <div class="container">
      <h1>Article title here</h1>
      <p>
        Article description/content here.
      </p>
      <a href="#" class="popUpAction" target="_blank">Read more from source</a>
    </div>
  </div>
  <section id="main" class="container">
    ${renderArticles(data.articles)}
  </section>
  `
}

render(app, state)
