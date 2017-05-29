import main, { add, subtract } from './math'
// main is default
// inside curly brackets are non default

console.log(add(1,23222))
console.log(subtract(1,2))
main()

import {delegate, siblings,closest} from './utils'

console.log('hi there hello')

const app = document.querySelector('#app')
let defaultV = 'Digg'

//Resources=====
// Mashable: http://mashable.com/stories.json
// Reddit: https://www.reddit.com/top.json
// Digg: http://digg.com/api/news/popular.json
//=====

window.onload =function(){
 stylingElements()
 state.source = defaultV
 getArticles() //<<==URL CALL
}

document.addEventListener('click',displayArticle,false)

function displayArticle(event){
  const target = event.target || event.srcElement
  if(!target || !target.className.includes('article')) return
  const te = target.parentElement
  const pe = te.parentElement
  const loaderEl = te.children[0]
  loaderEl.className = ''

  const windowInfo = window
  const windowInfoOuterHeight = windowInfo.outerHeight
  const windowInfoOuterWidth = windowInfo.outerWidth
  const mainContainer = document.getElementById('app')
  const mainContainerHeight = mainContainer.offsetHeight
  loaderEl.style.height = (windowInfoOuterHeight< mainContainerHeight ? mainContainerHeight: windowInfoOuterHeight)+100 +'px'

}


document.addEventListener('click',closeArticle,false)

function closeArticle(event){
  const target = event.target || event.srcElement
  if(!target || target.className!='closePopUp') return
  const loaderElement = target.parentElement
  loaderElement.className = 'loader hidden'

  return
}

document.addEventListener('click',displayDefaultFeedr,false)
function displayDefaultFeedr(event){
  const target = event.target || event.srcElement
  if(!target || target.nodeName !='H1' || target.id!='homeFeedrId') return

   stylingElements()
   state.source = defaultV
   getArticles()  //<<==URL CALL
}

document.addEventListener('click',selectFeeder,false)

function selectFeeder(event){
  const target = event.target || event.srcElement
  if(!target || target.nodeName !='A'
      || target.className==='sourceTitle'
      || target.className==='closePopUp') return
  stylingElements()
     state.source = target.innerText
     getArticles()  //<<==URL CALL
}

function stylingElements(){
  const windowInfo = window
  const windowInfoOuterHeight = windowInfo.outerHeight
  const windowInfoOuterWidth = windowInfo.outerWidth
  const sourceName = document.getElementById('sourceNameId');
  const sourceImage = document.getElementById('sourceImageId');
  const loadingElement = document.getElementById('loader');
  const loadingImage = document.getElementById('loaderImageId');

  if((sourceName !=null ) && (sourceImage !=null )){

     if((sourceName !='undefined') && (sourceImage !='undefined')){

       sourceName.className = 'hide'
       sourceImage.className = 'show'
      }
   }

   if((loadingElement !=null ) && (loadingImage !=null )){

      if((loadingElement !='undefined') && (loadingImage !='undefined')){
        loadingElement.className='loading'
        loadingElement.style.height = (windowInfoOuterHeight)+'px'
        loadingElement.style.width = (windowInfoOuterWidth)+'px'
        loadingImage.className = 'show imageLoader'
        loadingImage.style.top = (windowInfoOuterHeight/2)+'px'
        loadingImage.style.left = (windowInfoOuterWidth/2)+'px'
      }
   }
}

// state.articles = articles
// feedObject.arrayFeeds.push(articles)
// console.log("mynewArray",feedObject.arrayFeeds)

function getArticles(){

  const sourceName = document.getElementById('sourceNameId');
  const sourceImage = document.getElementById('sourceImageId');
  const loadingElement = document.getElementById('loader');
  const loadingImage = document.getElementById('loaderImageId');
  fetchArticles(state.source)
  .then(articles => {
    state.articles = articles  //Articles is already an array
    let count = 0
    for(let i=0; i< articles.length ; i++){
      for(let j=0; j<feedObject.arrayFeeds.length; j++){
        if(articles[i].title === feedObject.arrayFeeds[j].title){
          count++
        }
      }
      if(count===0){
        feedObject.arrayFeeds.push(articles[i])
      }


    }
   //feedObject.arrayFeeds.push(articles)   //ERROR: I am creating an array of array
    console.log("mynewArray",feedObject.arrayFeeds)
  })
  .then(() => {

    console.log("original state",state)
    render(app, state)
  })
  .then(()=>{
    if((sourceName !=null) && (sourceImage !=null )){
       if(( sourceName !='undefined')&& (sourceImage !='undefined')){
         if(sourceName.className === 'hide') {sourceName.className ='show'}
         if(sourceImage.className === 'show'){sourceImage.className = 'hide'}

       }
    }


    if((loadingElement !=null) && (loadingImage !=null )){
       if(( loadingElement !='undefined')&& (loadingImage !='undefined')){
          if(loadingElement.className==='loading'){loadingElement.className=''}
          if(loadingImage.className.includes('show')){loadingElement.className='hide'}
       }
    }

  })
}


const feedObject ={
  arrayFeeds:[
    {date:'xxx',image:'',title:'',theme:'',impressions:'',summary:'',link:'',}
  ]
}

const state = {
  source: defaultV,
  articles: [
    {
      date:'',
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
        date:article.post_date,
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


function fetchDiggArticles() {
  return fetchUrl('http://digg.com/api/news/popular.json')
  .then(res => res.json())
  .then(info => {
    console.log(info)


    return info.data.feed.map(article => {
      return {
        date:article.date_published,
        image: article.content.media.images[0].original_url,
        title: article.content.title,
        theme: article.content_type,
        impressions: article.fb_shares.count,
        summary: article.content.description,
        link: article.content.original_url
      }
    })
  })
}

function fetchRedditArticles() {
  return fetchUrl('https://www.reddit.com/top.json')
  .then(res => res.json())
  .then(info => {
    console.log(info)
    //console.log(info.data.children[0].data.preview.images.source.url)
    return info.data.children.map(article => {
      return {
        image: article.data.thumbnail,//article.data.preview.images[0].resolutions[0].url,
        title: article.data.title,
        theme: article.data.subreddit,
        impressions: article.data.num_comments,
        summary: article.data.title,
        link: article.data.url
      }
    })
  })
}

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

function renderArticles(articles) {
  return articles.map(article => `
    <article id="articleID" class="article articleDetailClass">
      <div id="popUp" class="loader hidden">
        <a href="#" class="closePopUp" data-sourceName=" ....source name here .....">X</a>
        <div class="container">
          <h1>${article.title}</h1>
          <p>
            ${article.theme}
            ${article.summary}
          </p>
          <a href="${article.link}" target="_blank" class="popUpAction" target="_blank">Read more from source</a>
        </div>
      </div>

      <!-- -->
      <section class="featuredImage">
        <img src="${article.image}" class="articleDetailClass" alt="" />
      </section>
      <section class="articleContent">
          <a href="${article.link}" class="articleDetailClass"></a>
          <h3 class="articleDetailClass">${article.title}</h3>
          <h6 class="articleDetailClass">${article.theme}</h6>
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
  <div id="loader" class=""></div>
  <img id="loaderImageId" class="hide" src="./images/ajax_loader.gif" alt="" />
    <section class="container">
      <a href="#"><h1 id="homeFeedrId">Feedr</h1></a>
      <nav>
        <ul>
          <li><a href="#" class="sourceTitle">News Source: <span id="sourceNameId" class="show">${data.source}</span> <img id="sourceImageId" class="hide" src="images/ajax_loader.gif" alt="" /></a>
            <ul>
                <li><a href="#" class="sourceClass" data-sourceid="0">Mashable</a></li>
                <li><a href="#"  class="sourceClass" data-sourceid="1">Digg</a></li>
                <li><a href="#"  class="sourceClass" data-sourceid="2">Reddit</a></li>
            </ul>
          </li>
        </ul>
        <section id="search">
          <input type="text" name="name" class="" value="">
          <a href="#"><img src="images/search.png" alt="" /></a>
        </section>
      </nav>
      <div class="clearfix"></div>
    </section>
  </header>
  <!--<div id="popUp" class="loader hidden">
    <a href="#" class="closePopUp">X</a>
    <div class="container">
      <h1>Article title here${data.articles.title}</h1>
      <p>
        Article description/content here.${data.articles.summary}
      </p>
      <a href="#" class="popUpAction" target="_blank">Read more from source</a>
    </div>
  </div>-->
  <section id="main" class="container">
    ${renderArticles(data.articles)}
  </section>
  `
}

getArticles()

/*
fetchArticles(state.source)
.then(articles => {
  state.articles = articles
  feedObject.arrayFeeds.push(articles)
  console.log("mynewArray",feedObject.arrayFeeds)
})
.then(() => render(app, state))
*/
