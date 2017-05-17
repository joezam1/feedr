const app = document.querySelector('#app')

const state = {
  source: 'mashable',
  loading:'',    //We load before the resquest and then we re set the load back to initial situation
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

function fetchMashableArticles(pages) {

 const promises =  new Array(pages)
 .fill('')
 .map((_,i) => fetchurl('http://mashable.com/stories.json?page=${i}')
.then(res=>res.json()))

  return Promise.all(promises)

  return fetchUrl('http://migbylab.com/feed.json')
  .then(res => res.json())
  .then(data => {
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
  }).reduce((flatArray, nextArr) => flatArray.concat(nextArr), [])
}

function fetchArticles(source) {
  if (source === 'mashable') {
    return fetchMashableArticles()
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
          <li><a href="#">News Source: <span>Source Name</span></a>
            <ul>
                <li><a href="#">Source 1</a></li>
                <li><a href="#">Source 2</a></li>
                <li><a href="#">Source 3</a></li>
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
