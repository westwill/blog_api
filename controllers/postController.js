import Post from '../models/post.models.js';

const newPost = async (req, res) => {
  try {
    const { category, title, content, image } = req.body;

    const userdetails = req.user;

    if (!category || !title || !content || !image) {
      res.status(400).json({
        success: false,
        message: 'All required fields needed',
      });
      return;
    }

    const post = await Post.create({
      author_name: userdetails?.name,
      author_id: userdetails?._id,
      author_image: userdetails?.image,
      category,
      title,
      content,
      image,
    });

    if (post) {
      res.status(201).json({
        success: true,
        message: 'Post Added',
        post,
      });
      return;
    } else {
      res.status(400).json({
        success: true,
        message: 'Post not added',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updatepost = async (req, res) => {
  try {
    const authuser = req.user;
    console.log('is user admin =>', authuser);
    const { id } = req.params;
    const body = req.body;
    console.log('the post Id', id);

    // to find if the post exist
    const postExist = await Post.findById(id).exec();
    if (!postExist) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }
    console.log('the existing post +>', postExist.author_id);

    console.log(' see me ', authuser._id.toHexString());
    // check if user is authorized===
    const check =
      postExist.author_id === authuser._id.toHexString() && authuser.isAdmin;
    console.log('the check =>', check);
    if (!check) {
      res.status(403).json({
        success: false,
        message: 'You can not do this!',
      });
      return;
    }

    const updatedPost = await Post.findByIdAndUpdate(postExist._id, body, {
      new: true,
    });
    if (!updatedPost) {
      res.status(400).json({
        success: false,
        message: 'Oga! Check your details.',
      });
      return;
    }
    res.status(201).json({
      success: true,
      message: 'Post Updated',
      updatedPost,
    });
    console.log('the updatedpost', updatedPost);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { newPost, updatepost };
