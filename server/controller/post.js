import Post from "../models/post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// export const getFeedPosts = async (req, res) => {
//   console.log(req.query, "query");
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     const options = {
//       limit: parseInt(limit),
//       skip: (page - 1) * limit,
//     };

//     const posts = await Post.find({}, null, options).sort({ createdAt: -1 });

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "userId");
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Make sure post.likes is defined and initialized as a Map
    if (!post.likes) {
      post.likes = new Map();
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment, userPicturePath, commentUserName } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      commentId: new Date().getTime() + Math.round(Math.random() * 1000000),
      userId,
      comment,
      commentPicturePath: userPicturePath,
      commentUserName,
    };
    console.log(newComment, "newComment");

    post.comments.push(newComment);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, commentId } = req.body;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment.commentId == commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.like = comment.like || [];
    comment.like.includes(userId)
      ? comment.like.splice(comment.like.indexOf(userId), 1)
      : comment.like.push(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    console.log(comment, "comment");
    res.status(200).json(updatedPost);
  } catch (error) {}
};
