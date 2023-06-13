import './App.css';
import db from './db.json';

import { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

const getRandomArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];

function getRandomQuote() {
  const quote = getRandomArrayItem(db.quotes);
  const author = db.authors.find(a => a[0] === quote[0]);

  return { author: author[1], bio: getRandomArrayItem(author[2]), quote: quote[2], tags: quote[3] };
}

function App() {
  return (
    <div className="App">
      <header>
        <h1>terrific quotes by terrible people</h1>
      </header>
      <Routes>
        <Route path='quotes'>
          <Route path='' element={<Home />} />
          <Route path='tags' element={<Tags />} />
          <Route path='tags/:tag' element={<Tag />} />
        </Route>
      </Routes>
    </div>
  );
}

function Quote({ quote }) {
  return (
    <article className="quote-container">
      <h2 className="quote"><span>“</span>{quote.quote}<span>”</span></h2>
      <section className='author'>
        <img src={require(`./pics/${quote.author}.jpg`)} alt={quote.author} />
        <section>
          <h3 className="authorName">– {quote.author}</h3>
          <h4 className="bio">known for {quote.bio}</h4>
        </section>
      </section>
      <section className="tags">{quote.tags.map((t, i) => <span key={i}>{t}</span>)}</section>
      <hr></hr>
    </article>
  );
}

function Home() {
  const [quotes, setQuotes] = useState([ getRandomQuote() ]);

  return (
    <main>
      {quotes.map((quote, index) => (
        <Quote key={index} quote={quote} />
      ))}

      <button id="more" onClick={() => setQuotes([...quotes, getRandomQuote()])}>Load 1 More</button>
    </main>
  );
}

function Tags() {
  return (
    <main>
      <h2>Tags</h2>
    </main>
  );
}

function Tag() {
  const { tag } = useParams();

  return (
    <main>
      <h2>Tag - {tag}</h2>
    </main>
  );
}

export default App;
