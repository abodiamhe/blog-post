import { Fragment } from 'react'
import { Post } from './Post.jsx'
import PropTypes from 'prop-types'

export function PostList({ posts = [] }) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post {...post} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

// we make use of the prop types from the Post component by wrapping it inside the PropTypes.shape()
PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
