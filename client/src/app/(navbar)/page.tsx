"use client"
import "../styles/globals.css"
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import dog from "../../../public/doggo.jpg";
import Post from "../components/Post"
import "../styles/post.css";

interface PostElem {
  id: number;
  username: string;
  content: string;
  file: string;
}


const Home: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [posts, setPosts] = useState<PostElem[]>([])
  const [openPostOverlay, setOpenPostOverlay] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [fileData, setFileData] = useState<File | null>(null)


  useEffect(() => {
    authenticate()
    getPosts()
  }, [])
  
  async function getPosts() {
    const response = await fetch("/api/getPOST", {
      method: "GET",
    })
    if (response.status == 200) {
        const responseData = await response.json()
        setPosts(responseData)
    }
  }
  async function authenticate() {
    const response = await fetch("/api/authenticate", {
      method: "GET",
    })
    if (response.status == 200) {
        const responseData = await response.json()
        setAuthenticated(true)
    }
  }
  

  function nextPost() {
    let curr = index
    if (curr + 1 >= posts.length) {
      curr = 0
    }
    else {
      curr = curr + 1
    }
    setIndex(curr)
  }

  function prevPost() {
    let curr = index
    if (curr - 1 < 0) {
      curr = posts.length-1
    }
    else {
      curr = curr - 1
    }
    setIndex(curr)
  }

  function createPostFunc() {
    setOpenPostOverlay(true)
  }

  
  function renderPosts(): JSX.Element {
    if (posts.length > 0) {
      return (
        <>
        <button className="btn text-xl" onClick={() =>{prevPost()}}>{'<'}</button>
        <Post id={posts[index].id} username={posts[index].username} content={posts[index].content} file={posts[index].file} createPostFunc={createPostFunc}/>
        <button className="btn text-xl" onClick={() =>{nextPost()}}>{'>'}</button>
        </>
      )
    }
    else {
      return(
        <button className="btn text-xl" onClick={() =>{createPostFunc()}}>Create Post</button>
      )
    }
    };
  
    function renderPostPage() {
      if (!openPostOverlay) {
        return renderPosts()
      }
      else {
        return renderPostCreationForm()
      }
    }

    async function handleSubmitPost(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      const formData = new FormData();
      if (fileData) {
        formData.append('file', fileData);
      }
      formData.append('content', postContent)


      const response = await fetch("/api/createPOST", {
        method: "POST",
        body: formData
      })
      .then(() => {
        getPosts()
        setPostContent("")
        setFileData(null)
      })
      setOpenPostOverlay(!openPostOverlay)
    }



    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; // Get the first selected file
      if (file) {
        setFileData(file);
      }
    }

    function renderPostCreationForm() {
      return (
        <form className="postForm" encType="multipart/form-data">
          <label>
            <textarea
              className="content-input"
              placeholder="Enter your post content here..."
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
              cols={50} 
            ></textarea>
          </label>
          <div className="post-button-container">
            <label>
              <input type="file" onChange={handleFileChange}/>
            </label>
            <label>
              <button className="btn text-xl" onClick={(event) =>{handleSubmitPost(event)}}>Submit Post</button>
            </label>
          </div>
        </form>
      );
    }

    function renderPage() {
      if (authenticated) {
        return(
          <div className="postsPage">
            {renderPostPage()}
          </div>
        )
      }
      else {
        return (
          <div className="home-section">
            <Image className="doggoPicture" src={dog} alt="Dog Picture"/>
            <h1 className="text-2xl">Welcome to Jinder!</h1>
          </div>
        )
      }
    }

  return (
    <main>
      <div className="homepage">
        {renderPage()}
      </div>
    </main>
  );
}

export default Home;
