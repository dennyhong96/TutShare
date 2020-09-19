const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
// const formidable = require("formidable");

const Category = require("../models/Category");
const Link = require("../models/Link");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();

// Transform image into buffer and upload s3
const s3UploadImage = async (image) => {
  // Process Image data
  const imageBase64Buffer = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const imageType = image.split(";")[0].split("/")[1];

  const s3UploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `category/${uuidv4()}.${imageType}`,
    Body: imageBase64Buffer, // sync -> Make sure file is loaded at the time of update
    ACL: process.env.AWS_S3_BUCKET_ACL, // public-read -> so user do can view image
    ContentType: `image/${imageType}`,
    ContentEncoding: "base64",
  };

  return await s3.upload(s3UploadParams).promise();

  //  { ...,
  //   Location: 'https://tutshare.s3.us-west-2.amazonaws.com/category/37af4ebd-7223-49c6-b7df-56f5f002dd9d',
  //   key: 'category/37af4ebd-7223-49c6-b7df-56f5f002dd9d',
  //   ... }
};

// Delete a s3 object by given key
const s3DeleteImage = async (key) => {
  const s3DeleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  return s3.deleteObject(s3DeleteParams).promise();
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;

    let data;
    try {
      data = await s3UploadImage(image);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errors: [{ msg: "Upload image failed, please try again." }],
      });
    }

    // Create the category
    category = await Category.create({
      name,
      image: { url: data.Location, key: data.Key }, // key is used for deleting images
      description,
      postedBy: req.user._id,
    });

    res.status(201).json({
      data: { category },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(500).json({
        errors: [{ msg: "Sorry, this category name is already in use." }],
      });
    }

    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      data: { categories },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const category = await Category.findOne({ slug });

    // Handle category does not exist
    if (!category) {
      return res.status(404).json({
        errors: [{ msg: "Category not found." }],
      });
    }

    // Get all links of this category
    const links = await Link.find({ categories: category })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      data: {
        category,
        links,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later" }],
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Handle category not exists
    let category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        errors: [{ msg: `Category with slug ${slug} not found.` }],
      });
    }

    const { name, description, image } = req.body;

    // Handle new name already in use
    if (category.name !== name) {
      const categoryWithRequestedName = await Category.findOne({ name });
      if (categoryWithRequestedName) {
        return res.status(404).json({
          errors: [{ msg: `Category with name ${name} already in use.` }],
        });
      }
    }

    // User passed in new image
    let uploadData;
    if (image) {
      // Delete existing image
      try {
        const deleteData = await s3DeleteImage(category.image.key);
        console.log("IMAGE DELETED", deleteData);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          errors: [{ msg: "Error deleting previous image, please try again." }],
        });
      }

      // Upload new image
      try {
        uploadData = await s3UploadImage(image);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          errors: [{ msg: "Upload image failed, please try again." }],
        });
      }
    }

    console.log({ uploadData });

    // Update category
    const mongoUpdateObj = { name, description };
    if (image && uploadData)
      mongoUpdateObj.image = {
        url: uploadData.Location,
        key: uploadData.Key,
      };

    category = await Category.findByIdAndUpdate(category._id, mongoUpdateObj, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      data: { category },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Handle category not found
    let category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        errors: [{ msg: `Category with slug ${slug} not found.` }],
      });
    }

    // Delete image from s3
    try {
      const deleteData = await s3DeleteImage(category.image.key);
      console.log("IMAGE DELETED", deleteData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errors: [{ msg: "Error deleting previous image, please try again." }],
      });
    }

    // Delete document
    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      data: { msg: "Category successfully deleted." },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ msg: "Something went wrong, please try again later." }],
    });
  }
};

/*
exports.createCategory = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      console.log({ fields, files });

      if (err) {
        console.err("formidable ERROR", err);
        return res.status(400).json({
          errors: [{ msg: `Upload image failed, please try again.` }],
        });
      }

      const { name, description } = fields;
      const { image } = files;

      // Handle category name already in user
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(500).json({
          errors: [{ msg: `Category name ${name} is already in use.` }],
        });
      }

      // Upload to s3
      // limit image size to 2mb
      if (image.size > 2000000) {
        return res.status(400).json({
          errors: [{ msg: `Image must be less than 2MB` }],
        });
      }

      const s3UploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `category/${uuidv4()}`,
        Body: fs.readFileSync(image.path), // sync -> Make sure file is loaded at the time of update
        ACL: process.env.AWS_S3_BUCKET_ACL, // public-read -> so user do can view image
        ContentType: process.env.AWS_S3_BUCKET_CONTENT_TYPE,
      };

      let data;
      try {
        data = await s3.upload(s3UploadParams).promise();
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          errors: [{ msg: "Upload image failed, please try again." }],
        });
      }


      // data: { ...,
      //   Location: 'https://tutshare.s3.us-west-2.amazonaws.com/category/37af4ebd-7223-49c6-b7df-56f5f002dd9d',
      //   key: 'category/37af4ebd-7223-49c6-b7df-56f5f002dd9d',
      //   ... }


      // Create the category
      category = await Category.create({
        name,
        image: { url: data.Location, key: data.Key }, // key is used for deleting images
        description,
        postedBy: req.user._id,
      });

      res.status(201).json({
        data: { category },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errors: [{ msg: "Something went wrong, please try again later" }],
      });
    }
  });
};
*/
