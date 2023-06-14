import './App.css';
import db from './db.min.json';

import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';

const getRandomArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];

function createQuoteObj(quote, author) {
  return { id: quote[0], author: author[1], bio: getRandomArrayItem(author[2]), quote: quote[2], tags: quote[3] };
}

function findQuoteAuthor(quote) {
  return db.authors.find(a => a[0] === quote[1]);
}

function getRandomQuote() {
  const quote = getRandomArrayItem(db.quotes);
  return createQuoteObj(quote, findQuoteAuthor(quote));
}

function getQuotesByAuthor(authorName) {
  const author = db.authors.find(a => a[1] === authorName);
  const quotes = db.quotes.filter(q => q[1] === author[0]).map(q => createQuoteObj(q, author));

  return quotes;
}

function getQuotesByTag(tag) {
  const quotes = db.quotes.filter(q => q[3].includes(tag)).map(q => createQuoteObj(q, findQuoteAuthor(q)));

  return quotes;
}

function getTagsFrequency() {
  const tags = Array.from(new Set(db.quotes.map(q => q[3]).flat())).sort();

  const frequency = tags.reduce((freq, tag) => {
    freq[tag] = db.quotes.filter(q => q[3].includes(tag)).length;
    return freq;
  }, {});

  return frequency;
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <header>
        <h1><a href="/quotes/#" className={location.pathname === '/' ? 'a-disabled' : undefined}>terrific quotes by terrible people</a></h1>
        <nav>
          <a href="/quotes/#/authors" className={location.pathname === '/authors' ? 'a-disabled' : undefined}>Authors</a>
          <span>&#9679;</span>
          <a href="/quotes/#/tags" className={location.pathname === '/tags' ? 'a-disabled' : undefined}>Tags</a>
          <span>&#9679;</span>
          <a href="https://github.com/gusalbukrk/quotes" target='_blank'><i className="fa-brands fa-github"></i></a>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tags' element={<Tags />} />
        <Route path='/tags/:tag' element={<Tag />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/authors/:author' element={<Author />} />
      </Routes>
    </div>
  );
}

function AuthorSection({ author, bio }) {
  return (
    <section className='author'>
      <img src={require(`./pics/${author}.jpg`)} alt={author} />
      <section>
        <h3 className="authorName"><a href={`/quotes/#/authors/${author}`}>{author}</a></h3>
        <h4 className="bio">known for {bio}</h4>
      </section>
    </section>
  );
}

function TagsSection({ tags, freq }) {
  return (
    <section className="tags">
      {tags.map((t, i) =>
        <span key={i}><a href={`/quotes/#/tags/${tags[i]}`}>{t}</a>{freq && <span className="freq">({freq[i]})</span>}</span>)
      }
    </section>
  );
}

function Quote({ quote, displayAuthorSection = true }) {
  return (
    <>
      <article className="quote-container">
        <h2 className="quote"><span>“</span>{quote.quote}<span>”</span></h2>
        { displayAuthorSection && <AuthorSection author={quote.author} bio={quote.bio} /> }
        <TagsSection tags={quote.tags} />
      </article>
      <hr />
    </>
  );
}

function Home() {
  const [quotes, setQuotes] = useState([ ...Array(3) ].map(() => getRandomQuote()));

  return (
    <main>
      {quotes.map(quote => (
        <Quote key={quote.id} quote={quote} />
      ))}

      <button id="more" onClick={() => setQuotes([...quotes, ...[ ...Array(3) ].map(() => getRandomQuote())])}><i class="fa-solid fa-plus fa-spin"></i>Load 3 More</button>
    </main>
  );
}

function Authors() {
  const authors = db.authors;

  return (
    <main id="AuthorsPage">
      <h2>Authors</h2>
      { authors.map((author, index) => <AuthorSection key={index} author={author[1]} bio={getRandomArrayItem(author[2])} />) }
    </main>
  );
}

function Author() {
  const { author } = useParams();
  const bio = getRandomArrayItem(db.authors.find(a => a[1] === author)[2]);

  const quotes = getQuotesByAuthor(author);

  return (
    <main id="AuthorPage">
      <AuthorSection author={author} bio={bio} />
      {quotes.map((quote, index) => (
        <Quote key={index} quote={quote} displayAuthorSection={false} />
      ))}
    </main>
  );
}

function Tags() {
  const frequency = getTagsFrequency();
  const tags = Object.keys(frequency);
  const freq = Object.values(frequency);

  return (
    <main id="TagsPage">
      <h2>Tags</h2>
      <TagsSection tags={tags} freq={freq} />
    </main>
  );
}

function Tag() {
  const { tag } = useParams();
  const quotes = getQuotesByTag(tag);

  return (
    <main id="TagPage">
      <h2 id="title">Tag:<span>{tag}</span></h2>
      {quotes.map((quote, index) => (
        <Quote key={index} quote={quote} />
      ))}
    </main>
  );
}

export default App;
