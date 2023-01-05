import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  const redirectToArticles = () => { navigate("/articles") }

  const logout = () => {
    localStorage.removeItem('token')
    redirectToLogin()
    setMessage("Goodbye!")
}

  const login = ({ username, password }) => {
    setMessage("")
    setSpinnerOn(true)
    axios.post(loginUrl, {username, password})
            .then((res) => {
                console.log(res)
                localStorage.setItem('token', res.data.token)
                setMessage(res.data.message)
                redirectToArticles()
            })
            .catch((err) => console.log(err))
            .finally(setSpinnerOn(false))
        
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  

  const getArticles = () => {
    setMessage("")
    axiosWithAuth()
    .get(articlesUrl)
    .then((res) => {
      console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
    })
    .catch((err) => {
      console.log(err)
      redirectToLogin()
    .finally(setSpinnerOn(false))
    })
    }
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!


  const postArticle = article => {
    setMessage("")
    axiosWithAuth()
    .post(articlesUrl, article)
    .then((res) => {
      const newArt = [...articles]
      newArt.push({...article, article_id: Date.now()})
      setArticles(newArt)
      setMessage(res.data.message)
    })
    .catch((err) => {
      console.log(err)
    })
    
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({article_id}, article) => {
    axiosWithAuth()
    .put(articlesUrl+"/"+article_id, article)
    .then((res) => {
      console.log(articles.map((art) => {
        if (art.article_id === article_id) {
          return (article)} 
        else {
            return art }
        }))
      setArticles(articles.map((art) => {
        if (art.article_id === article_id) {
          return ({...article, [article.article_id]: article_id})} 
        else {
            return art }
        }))
      setMessage(res.data.message)
      
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth()
    .delete(articlesUrl+"/"+article_id)
    .then((res) => {
      setArticles(articles.filter((art) => art.article_id !== article_id))
      setMessage(res.data.message)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(
      setSpinnerOn(false)
      
      )
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.filter((article) => {return article.article_id === currentArticleId})[0]}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                ssetCurrentArticleId={setCurrentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.filter((article) => {return article.article_id === currentArticleId})[0]}
                />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
